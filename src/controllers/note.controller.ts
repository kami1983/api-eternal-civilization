import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Note} from '../models';
import {NoteRepository} from '../repositories';

export class NoteController {
  constructor(
    @repository(NoteRepository)
    public noteRepository : NoteRepository,
  ) {}

  @post('/notes')
  @response(200, {
    description: 'Note model instance',
    content: {'application/json': {schema: getModelSchemaRef(Note)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {
            title: 'NewNote',
            exclude: ['id'],
          }),
        },
      },
    })
    note: Omit<Note, 'id'>,
  ): Promise<Note> {
    return this.noteRepository.create(note);
  }

  @get('/notes/count')
  @response(200, {
    description: 'Note model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Note) where?: Where<Note>,
  ): Promise<Count> {
    return this.noteRepository.count(where);
  }

  @get('/notes')
  @response(200, {
    description: 'Array of Note model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Note, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Note) filter?: Filter<Note>,
  ): Promise<Note[]> {
    return this.noteRepository.find(filter);
  }

  @patch('/notes')
  @response(200, {
    description: 'Note PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {partial: true}),
        },
      },
    })
    note: Note,
    @param.where(Note) where?: Where<Note>,
  ): Promise<Count> {
    return this.noteRepository.updateAll(note, where);
  }

  @get('/notes/{id}')
  @response(200, {
    description: 'Note model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Note, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Note, {exclude: 'where'}) filter?: FilterExcludingWhere<Note>
  ): Promise<Note> {
    return this.noteRepository.findById(id, filter);
  }

  @patch('/notes/{id}')
  @response(204, {
    description: 'Note PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Note, {partial: true}),
        },
      },
    })
    note: Note,
  ): Promise<void> {
    await this.noteRepository.updateById(id, note);
  }

  @put('/notes/{id}')
  @response(204, {
    description: 'Note PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() note: Note,
  ): Promise<void> {
    await this.noteRepository.replaceById(id, note);
  }

  @del('/notes/{id}')
  @response(204, {
    description: 'Note DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.noteRepository.deleteById(id);
  }
}
