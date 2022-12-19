import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import * as moment from "moment";
import { UserHasDevice } from "./entities/user-has-device.entity";

@Injectable()
export class UserHasDevicesService {
    constructor(@InjectRepository(UserHasDevice)
                private userDeviceRepository: Repository<UserHasDevice>) {
    }

    findAll(): Promise<UserHasDevice[]> {
        return this.userDeviceRepository.find();
    }

    async findOne(id: number): Promise<UserHasDevice> {
        return this.userDeviceRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.userDeviceRepository.delete(id);
    }

    async save(data: any): Promise<void> {
        return await this.userDeviceRepository.save(data);
    }

    async getUserFromJwt(token) {
        try {
            const userSession = await UserHasDevice.findOne({
                relations: ["user"],
                where    : {
                    token,
                    token_expired_at: MoreThanOrEqual(moment().toDate())
                }
            });
            return userSession ?? null;
        } catch (error) {
            return null;
        }
    };
}
