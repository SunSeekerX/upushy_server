import { DataSource } from 'typeorm'
import { DeviceInfoLogEntity, LoginLogEntity, UpdateLogEntity } from '../entities'
import { DEVICE_INFO_LOG_REPOSITORY, LOGIN_LOG_REPOSITORY, UPDATE_LOG_REPOSITORY } from 'src/app-shared/constant'

export const logProviders = [
  {
    provide: DEVICE_INFO_LOG_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(DeviceInfoLogEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: LOGIN_LOG_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(LoginLogEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: UPDATE_LOG_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UpdateLogEntity),
    inject: ['DATA_SOURCE'],
  },
]
