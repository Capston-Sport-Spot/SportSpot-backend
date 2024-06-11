const Hapi = require("@hapi/hapi");
const handler = require("./handler");
const { checkAuth , checkApiKey} = require("./middleware");

const routes = [

  //Account
  {
    method: "POST",
    path: "/register",
    handler: handler.registerHandler,
  },
  {
    method: "POST",
    path: "/login",
    handler: handler.loginHandler,
  },
  {
    method: "GET",
    path: "/profile",
    options :{
      pre:[{method: checkAuth}],
      handler : handler.profileHandler,

    }
  },
  {
    method: "PUT",
    path: "/profile",
    options :{
      pre:[{method: checkAuth}],
      handler : handler.updateProfileHandler,

    }

  },


  

  //Lapangan
  {
    method: "POST",
    path: "/addLapangan",
    options :{
      pre:[{method: checkApiKey}],
      handler : handler.addFieldHandler,
    }
  },
  {
    method: "GET",
    path: "/lapangans",
    handler: handler.getFieldHandler
  },
  {
    method: "GET",
    path: `/lapangans/{id}`,
    handler: handler.getFieldByidHandler,
  }
    
];

module.exports = routes;
