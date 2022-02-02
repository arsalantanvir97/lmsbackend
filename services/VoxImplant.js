// require("dotenv").config();

// const config = require("config");

import axios  from "axios"

const CREATE_VOX_USER = async (user_name,password,idd) => {
    console.log('CREATE_VOX_USER',user_name);
  try {

    let response = await axios({
      url: "https://api.voximplant.com/platform_api/AddUser",

      method: "POST",

      params: {
        account_id: "4265949",

        application_id: "10419302",

        application_name: "lmszainshah.arsalantanveer.n2.voximplant.com",

        api_key: "930bf7e4-f5b4-4a5c-befa-e5354b9b02a6",

        user_name:idd ,

        first_name: user_name,

        user_display_name: user_name,

        user_password: password
      }
    });

    console.log('response',response)

    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

export {CREATE_VOX_USER}