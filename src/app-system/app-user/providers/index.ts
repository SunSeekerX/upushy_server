import { DataSource } from 'typeorm'
import { UserEntity } from '../entities'
import { USER_REPOSITORY } from 'src/app-shared/constant'

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
]
