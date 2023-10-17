const db = require('../../connectors/db');
const roles = require('../../constants/roles');
const { getSessionToken } = require('../../utils/session');

const getUser = async function(req) {
  const sessionToken = getSessionToken(req);
  if (!sessionToken) {
    return res.status(301).redirect('/');
  }

  const user = await db.select('*')
    .from('naturalux.sessions')
    .where('token', sessionToken)
    .innerJoin('naturalux.users', 'naturalux.sessions.userid', 'naturalux.users.id')
    .innerJoin('naturalux.roles', 'naturalux.users.roleid', 'naturalux.roles.id')
    .first();
  
  console.log('user =>', user)
  user.isStudent = user.roleid === roles.student;
  user.isAdmin = user.roleid === roles.admin;
  user.isSenior = user.roleid === roles.senior;

  return user;  
}

module.exports = function(app) {
  // Register HTTP endpoint to render /users page
  app.get('/dashboard', async function(req, res) {
    const user = await getUser(req);
    return res.render('dashboard', user);
  });
  app.get('/dashboardx', async function(req, res) {
    const user = await getUser(req);
    return res.render('dashboard', user);
  });

  app.get('/users/add', async function(req, res) {
    return res.render('add-user');
  });
  // Register HTTP endpoint to render /users page
  app.get('/users', async function(req, res) {
    const users = await db.select('*').from('naturalux.users');
    const user = await getUser(req);

    return res.render('users', { users ,...user});
  });

  // // Register HTTP endpoint to render /courses page
  // app.get('/stations_example', async function(req, res) {
  //   const user = await getUser(req);
  //   const stations = await db.select('*').from('se_project.stations');
  //   return res.render('stations_example', { ...user, stations });
  // });

};
