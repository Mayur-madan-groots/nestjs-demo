#!/bin/bash/

echo "checking connection"

if
        aws ec2 describe-vpcs >/dev/null 2>&1; then
  echo -e "\nTest connection to AWS was successful.";
else
  echo -e "\nERROR: test connection to AWS failed. Please check the AWS keys.";
  exit 1;
fi

#Declaring Variables
vpc_id=vpc-e332298b
subnet_id=subnet-d85f5fb0
ami_id=ami-07ffb2f4d65357b42
instancename=alchemy-cli2
sgname=alchemySG-cli


#creating SG
echo "creating security group"
aws ec2 create-security-group --group-name $sgname --description "created for alchemy-poc"  --vpc-id "$vpc_id"  --output text >  /dev/null 2>&1

#retrieving the group-id of the security group created
sgid=`aws ec2 describe-security-groups  --query "SecurityGroups[].GroupId" --filters "Name=group-name,Values=$sgname" | sed -n 2p | tr -d \"`

#Adding the inbound rules to the security group created
aws ec2 authorize-security-group-ingress --group-id $sgid --protocol tcp --port 22 --cidr 0.0.0.0/0  >  /dev/null 2>&1
aws ec2 authorize-security-group-ingress --group-id $sgid --protocol tcp --port 8080 --cidr 0.0.0.0/0  >  /dev/null 2>&1

echo "security group created"



#Launching the instance"
echo "creating ec2"
aws ec2 run-instances --image-id $ami_id  --count 1 --instance-type t3.micro    --key-name alcemy_tech  --security-group-ids $sgid --subnet-id $subnet_id   --user-data file://userdata.txt   --block-device-mappings "[{\"DeviceName\":\"/dev/sdf\",\"Ebs\":{\"VolumeSize\":10,\"DeleteOnTermination\":true}}]"  --tag-specification "ResourceType=instance,Tags=[{Key=Name,Value=$instancename}]" --output text >  /dev/null 2>&1
echo "will take about 1 min to launch"
sleep 1m  #wait to get install all application mention inside userdata


#retriving the private ip of newly created ec2
PIP=`aws ec2 describe-instances  --query "Reservations[].Instances[].PrivateIpAddress" --filters "Name=tag:Name,Values=$instancename" | sed -n 2p | tr -d \"`

#retriving the old ip from config file
POIP="$(grep -E -o "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)" /var/lib/jenkins/.ssh/config)"

#replacing OLD IP with NEW IP in config file, also create a backup of already available config file 
sed -i'.BACKUP' "s/$POIP/$PIP/g" /var/lib/jenkins/.ssh/config
echo "ip replacement done"

#replacing ip in source code .env file to access database with new infra 
sed -i "s/DATABASE_HOST=localhost/DATABASE_HOST=$PIP/g" src/common/envs/development.env 
echo "ip replacement for .env to access DB-done"

#build dockerfile 
echo "building dockerfile"
docker build -t nest-cloud-run:latest .
echo "dockerfile build"

#push aplication image to remote 
echo "pushing application image"
ssh -o StrictHostKeyChecking=no test sudo chmod 666 /var/run/docker.sock
sudo docker save nest-cloud-run:latest | bzip2 | pv | ssh test docker load
echo "image pushed"

echo "container deplyment started"
# container deployment  
ssh -o StrictHostKeyChecking=no test sudo docker run -itd -p 8080:3000 --name=app-container  nest-cloud-run >  /dev/null 2>&1
echo "container deployment done"
echo "wait for 1 min to get container log"
ssh -o StrictHostKeyChecking=no test sleep 1m 
ssh -o StrictHostKeyChecking=no test sudo docker logs app-container 



#printing ip,id and port
echo -e "\033[0;31m'printing instance id,public ip and allowed port"
aws ec2 describe-instances  --filters Name=tag:Name,Values=$instancename   --query 'Reservations[*].Instances[*].{id:InstanceId,publicip:PublicIpAddress}'  --output table &&  aws ec2 describe-security-groups     --group-ids $sgid  --query "SecurityGroups[].IpPermissions[].{rule1:FromPort,rule2:ToPort}"   --output table


#retriving the public ip of newly created ec2
pubip=`aws ec2 describe-instances  --query "Reservations[].Instances[].PublicIpAddress" --filters "Name=tag:Name,Values=$instancename" | sed -n 2p | tr -d \"`

echo "we can access it using $pubip:8080"

#echo "termination start"

#terminating ec2
#echo "terminating ec2 after 4mins"
#sleep 4m
#echo "terminating ec2"
#aws ec2 terminate-instances --instance-ids $(aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId' --filters "Name=tag:Name,Values=$instancename" --output text) --output text   >  /dev/null 2>&1
#echo "ec2 terminated"

#delete SG
#echo "5mins to delete security group"
#sleep 5m

#echo "deleting Security group"

#aws ec2 delete-security-group --group-name $SGname  >  /dev/null 2>&1
#aws ec2 delete-security-group --group-id $sgid >  /dev/null 2>&1
#echo "security group deleted"

#termination using crontab

#CRON="55 16 * * *"

#COMMANDS="aws ec2 terminate-instances --instance-ids $(aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId' --filters "Name=tag:Name,Values=alchemy-cli2" --output text)"  
	
#aws ec2 delete-security-group --group-name alchemySG-cli

#ID=id=`aws ec2 describe-instances  --query "Reservations[].Instances[].InstanceId" --filters "Name=tag:Name,Values=alchemy-cli" | sed -n 2p | tr -d \"`

sudo echo "35 17 * * * aws ec2 terminate-instances --instance-ids $(aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId' --filters "Name=tag:Name,Values=alchemy-cli2" --output text) --output text" > /etc/cron.d/ec2-termination
echo "Cron job created. Remove /etc/cron.d/ec2-termination to stop it"

