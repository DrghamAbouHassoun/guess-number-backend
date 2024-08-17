import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/schemas/user.schema";
import { IUserCreate } from "src/types/user";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) { };

  async findAll() {
    const users = await this.userModel.find().select("name email mobile");
    return users;
  }

  async findUserById(id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new HttpException({
          success: false,
          messages: ["User not found"],
          data: [],
          status: 404,
        }, 200)
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException({
        success: false,
        messages: ["Something went wrong"],
        data: [],
        status: 500,
      }, 200)
    }
  }

  async findManyUsersByIds({ ids }: { ids: Types.ObjectId[] }) {
    const users = await this.userModel.find({ _id: { $in: ids }});
    return users;
  }

  async createUserAccount(data: IUserCreate) {
    const user = await this.userModel.findOne({ $or: [{ email: data.email, name: data.name }] })
    if (user) {
      throw new HttpException({
        success: false,
        messages: ["User email or name is already taken"],
        data: [],
        status: 400,
      }, 200)
    }
    
    const newUser = await this.userModel.create({
      name: data.name,
      email: data.email,
      password: data.password,
    })
    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    }
  }

  async findUserByEmail (email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new HttpException({
        success: false,
        messages: ["User not found"],
        data: [],
        status: 404,
      }, 200)
    }
    return user;
  }

  async changeUserStatus ({ userId, status }: { userId: string, status: boolean }) {
    const user = await this.userModel.findByIdAndUpdate(userId, { isActive: status }, { new: true });
    if (!user) {
      throw new HttpException({
        success: false,
        messages: ["User not found"],
        data: [],
        status: 404,
      }, 200)
    }
    return user;
  }

  async createManyUsers (users: { name: string, email: string, phone: string, image: string }[]) {
    try {
      const newUsers = await this.userModel.insertMany(
        users.map(user => ({
          name: user.name,
          email: user.email,
          password: "password1234",
          phone: user.phone,
          image: user.image
        }))
      )
      return newUsers;
    } catch (error) {
      console.log(error);
      throw new HttpException({
        success: false,
        messages: ["Failed to create users"],
        data: [],
        status: 500,
        error
      }, 200)
    }
    
  }
}