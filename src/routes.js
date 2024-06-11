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
      payload:{
        maxBytes: 10485760, // 10MB
        output: 'file',
        parse: true,
        multipart: true
      },
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
  },
  {
    method: "PUT",
    path: "/lapangan/{id}",
    options :{
      pre: [{ method: checkApiKey }],
      payload: {
          maxBytes: 10485760, // 10MB
          output: 'file',
          parse: true,
          multipart: true
      },
      handler : handler.updateFieldHandler,
    }

  },
  {
    method: "GET",
    path: `/searchLapangan`,
    handler: handler.searchFieldHandler,
  },



  //
    
];

module.exports = routes;
