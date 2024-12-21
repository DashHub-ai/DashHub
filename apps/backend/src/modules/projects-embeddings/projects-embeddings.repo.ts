import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '../database';

@injectable()
export class ProjectsEmbeddingsRepo extends createDatabaseRepo('projects_embeddings') {}
