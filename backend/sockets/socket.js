const Games = require("../models/games");

module.exports = (io) => {
    io.on("connection", function(socket) {
        const arr = {
            game: []
        }

        socket.on("startGame", async (res) => {
            try {
                const test = {
                    name: "vo",
                    tanks: {
                        position: [
                            {coord: 2},
                            {coord: 3},
                            {coord: 4},
                            {coord: 5},
                            {coord: 6},
                        ],
                        shot: [
                            {coord: 2},
                        ]
                    }
                }////test
                const game = arr.game.length
                
                if(test.tanks.position.length === 5) {

                    if(!game) {
                        arr.game.push(test)
                    }else if(game<2) {
                        const random =  Math.floor(Math.random()*2)
                        arr.game.push(test)
                        arr.step = arr.game[random].name
                        const creatGame = await Games(arr).save()
                        arr.game = [];

                        socket.emit("startGame", `Ваша игра готова, id: ${creatGame._id},random: ${random}`)
                    }/////можно переделать иф елсе наоборот

                }else {
                    console.log("error")
                }
                console.log(arr)

            } catch(e) {
                console.log(e)
            }
            socket.emit("res","dataInServis")
        })

        socket.on("Game", async (qwe) => {
            const res = {
                _id: "5edf9b5f78b8c81190b77eb6",
                name:"qwe"
            }///test

            try {
                const game = await Games.findOne({_id: res._id, "game.name": res.name})
                if(game) {
                    const player = game.game.find(p => p.name === res.name)
                    console.log(player)
                    socket.emit("Game", {
                        succes: true,
                        message: "Игрок найден",
                        player
                    })
                }else {
                    socket.emit("Game", {
                        succes: false,
                        message: "Вашей игры не найдено"
                    })
                }

            }catch(e) {
                console.log(e)
            }

        })

        socket.on("Shot", async (qwe) => {
            const res = {
                _id: "5edfb8263fbc8437145b0e80",
                name:"alo",
                shot: 123
            }///test

            try {
                const game = await Games.findOne({_id: res._id, "game.name": res.name})
                if(!game.statusGame) {
                    socket.emit("Shot", {
                        message: "Игра окончена"
                    })///Добавил проверку связаную с 110 строчкой
                }else {

                    if(game) {
                        const player = game.game.find(p => p.name === res.name)
                        const shot = player.tanks.shot.find(s => s.coord === res.shot)
                        
                        if(game.step === player.name) {

                            if(!shot) {
                                player.tanks.shot.push({coord: res.shot})///добавил добавление шот
                                const enemy = game.game.find(p => p.name != res.name)
                                const isShot = enemy.tanks.position.map(p => {
                                    if( p.coord === res.shot ) {
                                        p.isAlive = false
                                        return p
                                    }
                                    return p
                                })
                                /////Перезапись юзера который стреляет 
                                const changeUser = enemy.tanks.position.some(p => p.coord === res.shot)
                                if(!changeUser) {
                                    game.step = enemy.name
                                }
                                
                                ///// проверку сделал на завершение игры
                                const isDead =  isShot.every(element => element.isAlive === false)
        
                                if(isDead) {
                                    game.winner = player.name
                                    game.statusGame = false;
                                    socket.emit("Shot", {
                                        message: "Конец игры"
                                    })
                                }
                                game.save()
                            }
                            
                        }else {
                            socket.emit("Shot", {
                                message: "Сейчас не ваш ход"
                            })
                        }
                    }else {
                        console.log("game not")
                    }

                }
            }catch(e) {
                console.log(e)
            }
        })
    })
}