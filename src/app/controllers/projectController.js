const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

//Descomentar para utilizar um middlewarer de altenticação.
//router.use(authMiddleware);

//esta rota busca todos os docs e retorna apenas o ID do usuario
router.get('/allprojects', async (req, res) => {
  try {

    const { page = 1 } = req.query;
    const projects = await Project.paginate({}, { page, limit: 4 })

    return res.json(projects);

  } catch (error) {
    return res.status(400).send({ error: 'Erro ao carregar projetos' })
  }
});

//Esta rota tras todos os projetos com os dados do usuario pupulados
router.get('/', async (req, res) => {
  try {

    const projects = await Project.find().populate(['user', 'tasks']);

    return res.send({ projects });

  } catch (error) {
    return res.status(400).send({ error: 'Erro ao carregar projetos' })
  }
});

//Esta rota tras um projeto pelo seu ID
router.get('/:projectId', async (req, res) => {

  const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

  return res.send({ project });
});

//Esta rota registra um projeto
router.post('/', async (req, res) => {

  await router.use(authMiddleware);

  try {
    const { title, description, tasks } = req.body;

    const project = await Project.create({ title, description, user: req.userId });

    await Promise.all(tasks.map(async task => {
      const projectTasck = new Task({ ...task, project: project._id });

      await projectTasck.save();

      project.tasks.push(projectTasck);

    }));

    await project.save();

    return res.send({ project });

  } catch (err) {
    return res.status(400).send({ error: 'Erro ao criar um novo projeto ', err })
  }
});

//Esta rota atualiza o projeto pelo ID
router.put('/:projectId', async (req, res) => {

  try {
    const { title, description, tasks } = req.body;

    const project = await Project.findByIdAndUpdate(req.params.projectId, {
      title,
      description
    }, { new: true });

    project.tasks = [];
    await Task.remove({ project: project._id });

    await Promise.all(tasks.map(async task => {
      const projectTasck = new Task({ ...task, project: project._id });

      await projectTasck.save();

      project.tasks.push(projectTasck);

    }));

    await project.save();

    return res.send({ project });

  } catch (err) {
    return res.status(400).send({ error: 'Erro ao atualizar um projeto ', err })
  }

});

//Esta rota remove o projeto pelo ID
router.delete('/:projectId', async (req, res) => {

  try {

    await Project.findByIdAndRemove(req.params.projectId);

    return res.send();
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao tentar remover: ', err })
  }

});

//teste de remove allTasks -------------------------------------------------
router.delete('/rm/:projectId', async (req, res) => {

  try {
    const { title, description, tasks } = req.body;

    const project = await Project.findByIdAndRemove(req.params.projectId);

    await Task.remove({ project: project._id });

    return res.send('xD');

  } catch (err) {
    console.log(err);
    
    return res.status(400).send({ error: 'Erro ao remover um projeto ', err })
  }

});

module.exports = app => app.use('/projects', router);