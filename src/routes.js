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
  {
    method: 'GET',
    path: '/searchLapanganByKotaAndType',
    options: {
        pre: [{ method: checkAuth }], // Memeriksa autentikasi pengguna
        handler: handler.getFieldByKotaAndType,
  },
},





  //Reservation
  {
    method: "POST",
    path: "/reservations",
    options :{
      pre: [{ method: checkAuth }],
      handler : handler.reservationHandler,
    }
  },
  {
    method: "GET",
    path: "/reservations",
    options :{
      pre: [{ method: checkAuth }],
      handler : handler.getUserReservationHandler,
    }
  },
  {
    method: "GET",
    path: `/reservations/{lapanganId}/{subFieldName}`,
    handler: handler.getReservationbBySubFieldHandler,
  },
  {
    method: "GET",
    path: "/reservations/history",
    options :{
      pre: [{ method: checkAuth }],
      handler : handler.historyReservationHandler,
    }
  },




  //Events
  {
    method: 'POST',
    path: '/addEvent',
    options: {
        pre: [{ method: checkApiKey }],
        payload: {
            maxBytes: 10485760, // 10MB
            output: 'file',
            parse: true,
            multipart: true
        },
        handler: handler.addEventHandler,
    }
  },
  {
    method: "GET",
    path: `/events`,
    handler: handler.getEventHandler,
  },
  {
    method: "GET",
    path: `/events/{id}`,
    handler: handler.getEvnetByIdHandler,
  },
  {
    method: 'PUT',
    path: '/events/{id}',
    options: {
        pre: [{ method: checkApiKey }],
        payload: {
            maxBytes: 10485760, // 10MB
            output: 'file',
            parse: true,
            multipart: true
        },
        handler: handler.updateEventHandler,
  }
},
{
  method: "GET",
  path: `/searchEvent`,
  handler: handler.searchEventHandler,
},





//Community
{
  method: 'POST',
  path: '/addCommunity',
  options: {
      pre: [{ method: checkApiKey }], // Menambahkan checkApiKey sebagai pre-handler
      payload: {
          maxBytes: 10485760, // 10MB
          output: 'file',
          parse: true,
          multipart: true
      },
      handler : handler.addCommunityHandler,
  }
},
{
  method: 'GET',
  path: '/Community',
  handler: handler.getCommunityHandler,
},
{
  method: 'GET',
  path: '/Community/{id}',
  handler: handler.getCommunityByIdHandler,
},
{
  method: 'PUT',
  path: '/Community/{id}',
  options: {
      pre: [{ method: checkApiKey }],
      payload: {
          maxBytes: 10485760, // 10MB
          output: 'file',
          parse: true,
          multipart: true
      },
      handler: handler.updateCommunityHandler,
  }
},
{
  method: 'GET',
  path: '/searchCommunity',
  handler: handler.searchCommunityHandler,
},



//Article
{
  method: 'POST',
  path: '/importArticlesFromCSV',
  options: {
    pre: [{ method: checkApiKey }],
    payload: {
        maxBytes: 10485760, // 10MB
        output: 'stream',
        parse: true,
        multipart: true
    },
      handler : handler.importArticle,
  }
},
{
  method: 'GET',
  path: '/articles',
  handler: handler.getArticle,
},
{
  method: 'GET',
  path: '/articles/{articleId}',
  options: {
    pre: [{ method: checkAuth }]
  },
  handler: handler.getArticlebyId,
},
{
  method: 'GET',
  path: '/user/history',
  options: {
    pre: [{ method: checkAuth }]
  },
  handler: handler.getHistoryArticleUser,
},
{
  method: 'GET',
  path: '/recommend',
  options: {
    pre: [{ method: checkAuth }]
  },
  handler: handler.getRecomendationArticle,
},

];

module.exports = routes;
