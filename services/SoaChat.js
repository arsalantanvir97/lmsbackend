import axios from "axios"

const LoginSOASystem = async (id) => {
  const loginUser = await axios({
    url: `https://dev28.onlinetestingserver.com/soachatcentralizedWeb/api/login`,
    method: "POST",
    data: {
      appid: "891138e6e4ef6906e8a5cb92a1230eb0",
      secret_key:
        "$2y$10$Ku.CyAcR4WcglAGWtqIMgOH2BEdefI5AEHcXA.eAU5j0QVYEWvLaC",
      id,
    },
  })
  return loginUser.data.token
}

const MakeFriends = async (fromid, toid) => {
  console.log(
    "MakeFriendsMakeFriendsMakeFriendsMakeFriendsMakeFriendsMakeFriends",
    fromid,
    toid
  )
  try {
    console.log(fromid, toid)
    await axios({
      url: `https://dev28.onlinetestingserver.com/soachatcentralizedWeb/api/user/add-friends`,
      method: "POST",
      data: {
        appid: "d9c6677c1079de11c44bf886219b4540",
        secret_key:
          "$2y$10$vE6I7JValBoGkQgybfjaMePh2jfTGcJEXDq0n5Yck5oyIpVx2sjJC",
        fromid: fromid,
        toid: toid,
        auto_accept: true,
      },
    })
  } catch (err) {
    console.log(err)
  }
}

const addSoaUser = async (id, first_name) =>
  await axios({
    url: "https://dev28.onlinetestingserver.com/soachatcentralizedWeb/api/user/add",
    method: "POST",
    data: {
      appid: "d9c6677c1079de11c44bf886219b4540",
      secret_key:
        "$2y$10$vE6I7JValBoGkQgybfjaMePh2jfTGcJEXDq0n5Yck5oyIpVx2sjJC",
      id,
      name: `${first_name}`,
      avatar: "https://www.w3schools.com/w3images/avatar2.png",
    },
  })

export { LoginSOASystem, MakeFriends, addSoaUser }
