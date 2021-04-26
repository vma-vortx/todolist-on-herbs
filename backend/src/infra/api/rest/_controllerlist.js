const listEntity = require('../../../domain/entities/todoList')
const itemEntity = require('../../../domain/entities/item')

module.exports = [
    {
        name: 'lists',
        entity: listEntity.TodoList,
        get: require('../../../domain/usecases/getLists').getLists(),
        post: require('../../../domain/usecases/createList').createList(),
        put: require('../../../domain/usecases/updateList').updateList(),
        delete: require('../../../domain/usecases/deleteList').deleteList()
    },
    {
        name: 'items',
        entity: itemEntity.Item,
        post: require('../../../domain/usecases/createItem').createItem(),
        put: require('../../../domain/usecases/updateItem').updateItem(),
        //TODO: Verify usability
        successStatusCode: 200,
        errorStatusCode: 400
    }
]