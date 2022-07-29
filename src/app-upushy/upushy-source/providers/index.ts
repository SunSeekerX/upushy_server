import { DataSource } from 'typeorm'
import { SourceEntity } from '../entities'
import { SOURCE_REPOSITORY } from 'src/app-shared/constant'

export const sourceProviders = [
  {
    provide: SOURCE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SourceEntity),
    inject: ['DATA_SOURCE'],
  },
]
