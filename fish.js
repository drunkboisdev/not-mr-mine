console.log("i know what you are")
// upgrades
var upgrades = 0
var ironEfficiency = 0
var getWoodRod, coalUnlock, smelteryUnlock, ironUnlock, getIronAxe, getIronPick, getIronRod, steelUnlock, getSteelAxe, getSteelPick, getSteelRod //use rod variables for fishing (you weclome)
// resources
var chopPower = 0
var minePower = 0
var chopInterval

var autoWoodTier = 0
var autoStoneTier = 0
var wood = 0
var stone = 0
var coal = 0
var coalChance = 0
var iron = 0
var ironChance = 0
var ironTreasureChance = 0
var ironTreasureChests = 0
var steel = 0
var fish = [0, 0, 0, 0, 0, 0, 0]
var crates = [0, 0, 0, 0]
// perch, bass, trout, salmon, carp, asp, pike, crateWood, crateIron, crateSteel, crateMystery
var fishChance

var resType
var resAmount

const missingUpgrades = "unlock every upgrade from the last tier before unlocking this one"
const missingResources = "you are poor"
const alreadyObtained = "you already have that"

const fakeSemVer = "0.2.0"
const intVer = "2.7.6"
const resDisp = document.getElementById("resourceDisplay")
const treasureDisp = document.getElementById("getStuff")
const smeltery = document.getElementById("smeltery")
const smeltDisp = document.getElementById("smeltDisp")
const smeltUI = document.createElement("div")

smeltUI.style.position = "absolute"
smeltUI.style.width = "480px"
smeltUI.style.height = "320px"
smeltUI.style.marginTop = "6px"
smeltUI.style.zIndex = "1"
smeltUI.style.border = "2px solid black"
smeltUI.style.backgroundColor = "white"

function update(chatLog, upgradeLog) {
    document.getElementById("woodDisplay").innerHTML = `you have ${wood} wood`
    document.getElementById("stoneDisplay").innerHTML = `you have ${stone} stone`
    if (coalUnlock) {
        document.getElementById("coalDisplay").innerHTML = `you have ${coal} coal`
    }
    if (ironUnlock) {
        document.getElementById("ironDisplay").innerHTML = `you have ${iron} iron`
    }
    if (steelUnlock) {
        document.getElementById("steelDisplay").innerHTML = `you have ${steel} steel`
    }
    if (upgrades === 1) {
        document.getElementById("upgrad").innerHTML = `you have 1 upgrade`
    } else {
        document.getElementById("upgrad").innerHTML = `you have ${upgrades} upgrades`
    }
    if (typeof chatLog === "string") {        
        document.getElementById("chatlog").innerHTML = chatLog   
    }
    if (typeof upgradeLog === "string") {        
        document.getElementById("unlockLog").innerHTML += `${upgradeLog}<br>`
    }
}

var upgrade = { // yknow im actually not entirely sure why this is an object it really doesn't need to be
    // -1 is not tiered, numbers above 0 mark what tier it is 
    buy: function (id, tier, woodCost = 0, stoneCost = 0, ironCost = 0, steelCost = 0) {
        let clogText = ""
        let ulogText = 69 // LOL!!!! LAUGH NOW!
        let refund
        let autoWoodCost = [25, 250, 2500, 25000]

        if (tier !== -1) {
            
        }
        if (id === 1) {
            const autoWood = document.getElementById("autoWood")
            const awcCost = document.getElementById("awcCost")
            //const autoStone = document.getElementById("autoStone") put these in the stone function
            //const ascCost = document.getElementById("ascCost")

            autoWood.value = "automate wood faster"
            awcCost.innerHTML = `${autoWoodCost[tier + 1]} stone`

            this.autoWood(9 ** tier / 10 ** tier) // multiplicative 10% speed increase
        } else if (id === 2) {
            autoStone.value = "automate stone faster"
            ascCost.innerHTML = `${woodCost} wood`
        } else {
            clogText = "this upgrade doesn't exist (yet?)"
            console.log("this... isn't an upgrade.")
        }

        if (refund) {
            woodCost = 0
            stoneCost = 0
            ironCost = 0
            steelCost = 0
            upgrades--
        }

        wood -= woodCost
        stone -= stoneCost
        iron -= ironCost
        steel -= steelCost
        upgrades++
        update(clogText, ulogText)
    },
    autoWood: function(autoSpeed) { // im aware this isn't that efficient but shut up i like my neatly organized, clearly defined upgrade functions
        if (chopInterval !== undefined) {
            clearInterval(chopInterval)
            console.log("interval cleared")
        }
        chopInterval = setInterval(chopWood, autoSpeed)
        console.log(autoSpeed)
    }
}

function buyUpgrade(upgradeId, woodCost = 0, stoneCost = 0, ironCost = 0, steelCost = 0) {
    let clogText = ""
    let ulogText = 69 // unfunny joke
    let refund

    /*switch (upgradeId) {
        case 1:
            if (autoWood < 1 && stone >= stoneCost) {
                autoWood = 1
                var autoWoodt1 = setInterval(chopWood, chopTime)        

                ulogText = "wood is now automated"
            } else if (autoWood < 1) { 
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 2:
            if (autoStone < 1 && wood >= woodCost) {
                autoStone = 1
                var autoStonet1 = setInterval(mineStone, mineTime)

                ulogText = "stone is now automated"
            } else if (autoStone < 1) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 3:
            if (coalUnlock !== true && wood >= woodCost && stone >= stoneCost && upgrades >= 2) {
                coalChance = 15
                let coalP = document.createElement("p")
                coalP.appendChild(document.createTextNode("you have 0 coal")) // im gonna be real i have no idea what a text node is
                coalP.id = "coalDisplay"
                resDisp.appendChild(coalP)
                coalUnlock = true

                ulogText = "coal has been unlocked"
            } else if (upgrades <= 2) {
                clogText = missingUpgrades
                refund = true
            } else if (coalUnlock !== true) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 4:
            if (smelteryUnlock !== true && wood >= woodCost && stone >= stoneCost && upgrades >= 2) {
                smelteryUnlock = true
                smeltery.value = " open forge "
                document.getElementById("smelteryText").innerHTML = "click to smelt unlocked materials"
                smeltery.onclick = function openSmeltUI() {
                    smeltDisp.appendChild(smeltUI)  
                    smeltery.value = "close forge"

                    smeltery.onclick = function closeSmeltUI() {
                        smeltUI.remove()
                        smeltery.value = " open forge "
                        smeltery.onclick = function why() {
                            // js is stupid and there's probably a better way to do this
                            openSmeltUI()
                        }
                    }
                }

                ulogText = "forge has been unlocked"
            } else if (upgrades <= 2) {
                clogText = missingUpgrades
                refund = true
            } else if (smelteryUnlock !== true) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 5:
            if (ironUnlock !== true && wood >= woodCost && stone >= stoneCost && upgrades >= 2) {
                ironUnlock = true
                ironChance = 5
                let ironP = document.createElement("p")
                ironP.appendChild(document.createTextNode("you have 0 coal")) // coal jumpscare
                ironP.id = "ironDisplay"
                resDisp.appendChild(ironP)

                let treasureB = document.createElement("input")
                treasureB.className = "h"
                treasureB.type = "button"
                treasureB.id = "iTC"
                treasureB.onclick = function() {
                    if (ironTreasureChests > 0) {
                        wood += Math.floor(Math.random() * 20) + 40
                        stone += Math.floor(Math.random() * 20) + 40
                        iron += Math.floor(Math.random() * 10) + 5
                        ironTreasureChests--
                        if (ironTreasureChests === 1) {
                            document.getElementById("iTC").value = `${ironTreasureChests} iron treasure chest`    
                        } else {
                            document.getElementById("iTC").value = `${ironTreasureChests} iron treasure chests`
                        }
                        update("treasure chest opened")
                    } else {
                        update("you have no more treasure chests")
                    }
                }
                treasureB.value = "0 iron treasure chests"
                treasureDisp.appendChild(treasureB)

                ulogText = "iron has been unlocked"
            } else if (upgrades <= 2) {
                clogText = missingUpgrades
                refund = true
            } else if (ironUnlock !== true && upgrades >= 2) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 6:
            if (getIronAxe !== true && wood >= woodCost && stone >= stoneCost && iron >= ironCost && upgrades >= 6) {
                getIronAxe = true
                chopPower = 1

                ulogText = "iron axe unlocked, +1 chop power"
            } else if (upgrades < 5) {
                clogText = missingUpgrades
                refund = true
            } else if (getIronAxe !== true) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 7:
            if (getIronPick !== true && wood >= woodCost && stone >= stoneCost && iron >= ironCost && upgrades >= 6) {
                getIronPick = true
                minePower = 1

                ulogText = "iron pickaxe unlocked, +1 mining power"
            } else if (upgrades < 5) {
                clogText = missingUpgrades
                refund = true
            } else if (getIronPick !== true) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 8:
            if (steelUnlock !== true && wood >= woodCost && stone >= stoneCost && iron >= ironCost && upgrades >= 6) {
                steelUnlock = true
                let steelP = document.createElement("p")
                steelP.appendChild(document.createTextNode("you have 0 coal"))
                steelP.id = "steelDisplay"
                resDisp.appendChild(steelP)

                smeltButton(1, 1e+0, "steel")
                smeltButton(1, 1e+1, "steel")
                smeltButton(1, 1e+2, "steel")

                ulogText = "steel has been unlocked"
            } else if (upgrades < 5) {
                clogText = missingUpgrades
                refund = true
            } else if (steelUnlock !== true) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 9:
            if (ironEfficiency < 1 && wood >= woodCost && stone >= stoneCost && iron >= ironCost && upgrades >= 6) {
                ironEfficiency = 1
                ironChance += 5                    
                
                ulogText = "iron efficiency increased"
            } else if (upgrades < 5) {
                clogText = missingUpgrades
                refund = true
            } else if (ironEfficiency < 1) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 10:
            if (getSteelAxe !== true && wood >= woodCost && stone >= stoneCost && steel >= steelCost && upgrades >= 11) {
                getSteelAxe = true
                chopPower = 3
                
                ulogText = "steel axe unlocked, +3 chop power"
            } else if (upgrades < 9) {
                clogText = missingUpgrades
                refund = true
            } else if (getSteelAxe !== true) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 11:
            if (getSteelPick !== true && wood >= woodCost && stone >= stoneCost && steel >= steelCost && upgrades >= 11) {
                getSteelPick = true
                minePower = 3
                
                ulogText = "steel pickaxe unlocked, +3 mining power"
            } else if (upgrades < 9) {
                clogText = missingUpgrades
                refund = true
            } else if (getSteelPick !== true) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 12:
            if (ironEfficiency < 2 && wood >= woodCost && stone >= stoneCost && steel >= steelCost && upgrades >= 11) {
                ironEfficiency = 2
                ironChance += 5
                
                ulogText = "iron efficiency increased"
            } else if (upgrades < 9) {
                clogText = missingUpgrades
                refund = true
            } else if (ironEfficiency < 2) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
        case 13:
            if (getWoodRod !== true && wood >= woodCost && stone >= stoneCost && iron >= ironCost && upgrades >= 2) {
                getWoodRod = true
                fishChance = 30
                
                ulogText = "wooden rod unlocked, you can fish now!"
            } else if (upgrades < 9) {
                clogText = missingUpgrades
                refund = true
            } else if (autoWood < 2) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break  
        case 14:
            if (getIronRod !== true && wood >= woodCost && stone >= stoneCost && iron >= ironCost && upgrades >= 6) {
                getIronRod = true   
                
                ulogText = "iron rod unlocked"
            } else if (upgrades < 6) {
                clogText = missingUpgrades
                refund = true
            } else if (getIronRod !== true) {
                clogText = missingResources
                refund = true
            } else {
                clogText = alreadyObtained
                refund = true
            }
            break
            case 16:
                if (autoWood < 2 && wood >= woodCost && stone >= stoneCost && iron >= ironCost && upgrades >= 11) {
                    autoWood = 2
                    chopTime = Math.floor(chopTime * 0.9)
                    clearInterval(autoWoodt1) // this doesn't work for some fucking reason
                    //var autoWoodt2 = setInterval(chopWood, 900)
                
                    ulogText = "wood automation speed is now the same"
                } else if (upgrades < 9) {
                    clogText = missingUpgrades
                    refund = true
                } else if (autoWood < 2) {
                    clogText = missingResources
                    refund = true
                } else {
                    clogText = alreadyObtained
                    refund = true
                }
                break
            case 17:
                if (autoStone < 2 && wood >= woodCost && stone >= stoneCost && iron >= ironCost && upgrades >= 11) {
                    autoStone = 2
                    mineTime = Math.floor(mineTime * 0.9)

                    clearInterval(autoStonet1) // this doesn't work for some fucking reason
                    //var autoStonet2 = setInterval(mineStone, mineTime)
                
                    ulogText = "stone automation speed is now the same"
                } else if (upgrades < 9) {
                    clogText = missingUpgrades
                    refund = true
                } else if (autoWood < 2) {
                    clogText = missingResources
                    refund = true
                } else {
                    clogText = alreadyObtained
                    refund = true
                }
                break
        default:
                throw "OutOfBounds: invalid upgrade id"
        }*/

        if (refund) {
            woodCost = 0
            stoneCost = 0
            ironCost = 0
            steelCost = 0
            upgrades--
        }

        wood -= woodCost
        stone -= stoneCost
        iron -= ironCost
        steel -= steelCost
        upgrades++
        update(clogText, ulogText)
        /*
            upgrade ids:
            auto wood 1
            auto stone 2
            unlock coal 3
            unlock smeltery 4
            unlock iron 5
            iron axe 6
            iron pickaxe 7
            unlock steel 8
            iron efficiency I 9
            steel axe 10
            steel pickaxe 11
            iron efficiency II 12
            wooden rod 13
            iron rod 14
            steel rod 15
            wood efficiency II 16
            stone efficiency II 16
        */
}

function chopWood() {
    wood += 1 + chopPower
    update()
}
function mineStone() {
    stone += 1 + minePower
    
    var getOre = Math.floor(Math.random() * 100)

    if (getOre < ironChance){
        iron++

        ironTreasureChance = Math.floor(Math.random() * 10)
        if (ironTreasureChance === 0){
            ironTreasureChests++
            if (ironTreasureChests === 1) {
                document.getElementById("iTC").value = `${ironTreasureChests} iron treasure chest`    
            } else {
                document.getElementById("iTC").value = `${ironTreasureChests} iron treasure chests`
            }
            
            update("you found a treasure chest")
        }
    }
    else if (getOre < coalChance + ironChance) {
        coal++
    }
    update()
}

function fishFish() {
    // console.log("'Fishing is much more than fish. It is the great occasion when we may return to the fine simplicity of our forefathers.'\n- Herbert Hoover, 31st President of the United States")
    fishChance = Math.floor(Math.random() * 200)
    if (fishChance < 2) {
        console.log("sorry fish dont exist yet")
    }
    wood += 1 + chopPower
    update()
}

function smeltButton(type, amount, resource) {
    const newButton = document.createElement("input")
    newButton.type = "button"
    newButton.value = `make ${amount} ${resource}`
    newButton.className = "h"
    newButton.style.margin = "6px"
    smeltUI.appendChild(newButton)
    newButton.addEventListener("click", function() {smelting(type, amount)})
}

function smelting(resource, amount) {
    /*resource ids:
    steel: 1*/
    console.log("balls")

    switch (resource) { // switch/case statement in case other things need to be smelted later
    case 1:
        if (coal >= 5 * amount && iron >= 3 * amount) {
            coal -= 5 * amount
            iron -= 3 * amount
            steel += amount
        } else {
            update("you are poor")
        }
        break
    default:
        update("this material doesn't exist, sorry :/")
        throw "error 2: this material doesn't exist"
    }
    
    update()
}

function lol(lmao) {
    if (lmao) {
        wood += 100000
        stone += 100000
        coal += 100000
        iron += 100000
        steel += 100000
    } else {
        wood *= 100
        stone *= 100
        coal *= 100
        iron *= 100
        steel *= 100
    }
    if (wood > 1e+6) {
        return "you really don't need this much stuff"
    } else {
        return "troll complete, returning to hq"
    }
}
/* BUGS TO FIX LATER (stinky)
    - tier 1 upgrade costs are aligned left for some reason (i have zero css knowledge how fix)
    - hi if you're seeing this add bugs here as you find them
    - faster automation upgrades DO NOT CLEAR THE PREVIOUS INTERVAL I DON'T KNOW WHY
*/