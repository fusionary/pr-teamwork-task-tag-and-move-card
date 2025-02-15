const {getRequest, putRequest} = require('../../functions.js')
const core = require('@actions/core')
require('dotenv').config()

describe('test REST request', function () {

  it('gets a tag from teamwork using a search term', async function() {
    spyOn(core, 'getInput').and.returnValue(process.env.TW_KEY)
    spyOn(console, 'log').and.callThrough()

    let tag = await getRequest('https://fusionary.teamwork.com/projects/api/v3/tags.json?projectIds=0&searchTerm=estimate')
    expect(tag.tags[0].id).toBe(81729)
  })

  it('moves a task to the "released" column', async function () {
    spyOn(core, 'getInput').and.returnValue(process.env.TW_KEY)
    spyOn(console, 'log').and.callThrough()

    let res = await putRequest('https://fusionary.teamwork.com/boards/columns/cards/819057/move.json', '{"cardId": 819057,"positionAfterId": 0,"columnId": 147457}')
    expect(res.STATUS).toBe("OK")

    let card = await getRequest('https://fusionary.teamwork.com/boards/columns/cards/819057.json')
    expect(card.card.column.id).toBe('147457')
  })

  it('moves a task to the "in progress" column', async function () {
    spyOn(core, 'getInput').and.returnValue(process.env.TW_KEY)
    spyOn(console, 'log').and.callThrough()

    let res = await putRequest('https://fusionary.teamwork.com/boards/columns/cards/819057/move.json', '{"cardId": 819057,"positionAfterId": 0,"columnId": 147456}')
    expect(res.STATUS).toBe("OK")

    let card = await getRequest('https://fusionary.teamwork.com/boards/columns/cards/819057.json')
    expect(card.card.column.id).toBe('147456')
  })

  it('adds the "code review" tag to the task', async function () {
    spyOn(core, 'getInput').and.returnValue(process.env.TW_KEY)
    spyOn(console, 'log').and.callThrough()

    await putRequest('https://fusionary.teamwork.com/projects/api/v3/tasks/26801523/tags.json', '{"replaceExistingTags": true, "tagIds": [176922]}')

    let tags = await getRequest('https://fusionary.teamwork.com/tasks/26801523/tags.json')
    expect(tags.tags.find((tag => tag.id == 176922)).id).toBe('176922')
  })

  it('gets task data using the teamwork v1 api', async function () {
    spyOn(core, 'getInput').and.returnValue(process.env.TW_KEY)
    spyOn(console, 'log').and.callThrough()

    let project = await getRequest('https://fusionary.teamwork.com/tasks/26801523.json')
    expect(project['todo-item']['project-id']).toBe(424228)
  })
})