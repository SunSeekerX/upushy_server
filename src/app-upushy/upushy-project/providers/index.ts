import { DataSource } from 'typeorm'
import { ProjectEntity } from '../entities'
import { PROJECT_REPOSITORY } from 'src/app-shared/constant'

export const projectProviders = [
  {
    provide: PROJECT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ProjectEntity),
    inject: ['DATA_SOURCE'],
  },
]
