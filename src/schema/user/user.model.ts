// Libraries
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field as GqlField, ObjectType as GqlObjectType } from "type-graphql";

@GqlObjectType()
export class User {
  @GqlField()
  readonly _id!: string;

  @Property({ default: new Date() })
  @GqlField(() => Date)
  createdAt: Date;

  @Property({ default: new Date() })
  @GqlField(() => Date)
  updatedAt: Date;

  @Property()
  @GqlField(() => String)
  username: string;

  @Property()
  @GqlField(() => String)
  name: string;
}

export const UserModel = getModelForClass(User);
