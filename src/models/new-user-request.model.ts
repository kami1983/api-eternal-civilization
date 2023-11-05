// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {User} from '@loopback/authentication-jwt';
import {model, property} from '@loopback/repository';

@model({
  settings: {
    strict: true,
  }
})
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: false,
    default: '',
  })
  password: string;
}


export interface NewUserRequestRelations {
  // describe navigational properties here
}

export type NewUserRequestWithNewUserRequestRelations = NewUserRequest & NewUserRequestRelations;


