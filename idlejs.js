window.onload = function(e) {
    new Vue({
        template: `<div id="app">
            <div class="myclass" id="myid">
                <a href="https://francis-brenner-portfolio.glitch.me/" id="navigation">Back</a>
                <h1 style="margin-top: 10px">Poetry Simulator</h1>
                <h4><i>"A poet is, before anything else, a person who is passionately in love with language." -W.H. Auden</i></h4>
                <h2>Day: {{day}}</h2>

                <p v-if="automated" style="height: 6px">PoetTPG is running...</p>
                <div id="leftSide">
                    <table>
                        <tr>
                            <td>Poems:</td>
                            <td>{{poems}}</td>
                            <td>Fatigue:</td>
                            <td>{{fatigue}} / {{maxFatigue}}</td>
                        <tr>
                        <tr>
                            <td>Money:</td>
                            <td>\${{money}}</td>
                            <td>Hunger:</td>
                            <td>{{hunger}} / {{maxHunger}}</td>
                        <tr>
                    </table>
                    <br />

                    <table id="buttonTable">
                        <tr>
                            <td><button @click="writingPoem">Write a Poem</button></td>
                            <td><button @click="sellPoem">Sell a Poem</button></td>
                        </tr> <tr>
                            <td><button @click="sleep">Go to Sleep</button></td>
                            <td><button @click="buyFood">Buy Some Food (\${{foodPrice}})</button></td>
                        </tr>
                        <tr>
                            <td>
                            <button @click="buyCapitalistPTG" v-show="automated && !capitalistAutomated">Buy CapitalistPTG (\${{capitalistPTGPrice}})</button>
                            <button @click="buyCapitalistPTG" v-show="capitalistAutomated">Buy CapitalistPTG (\${{capitalistPTGPrice}})</button>
                            </td>
                            <td>
                            <button @click="buyPoetTPG" v-show="!automated">Buy PoetTPG (\${{poetTPGPrice}})</button>
                            <button @click="upgradePoetTPG" v-show="automated">Upgrade PoetTPG (\${{poetTPGPrice}})</button>
                            </td>
                        </tr>
                    </table>
                    <br /> <br />

                    <div id="messageBox">
                        <u>Messages</u>
                        <div v-for="message in messageArray">
                            {{message}}
                        </div>
                    </div>

                    <div id="poemBox">
                        <u>Poems</u>
                        <div v-for="poem in poemArray">
                            <span style="white-space: pre-line">{{poem}}</span>
                            <hr>
                        </div>
                    </div>
                </div>

                <div v-if="writing" id="poemInput">
                    Write your poem below: <span v-if="poemInput.length < 100">({{poemInput.length}} / 100)</span><b v-if="poemInput.length >= 100">Ready to Finish!</b>
                    <br />
                    <textarea v-model="poemInput" v-focus></textarea><br />
                    <button @click="makePoem">Finish</button>
                    <br /> <br />
                </div>
            </div>
        </div>
        `,

        computed: {

        },

        // https://stackoverflow.com/questions/34941829/setting-focus-of-an-input-element-in-vue-js
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus()
                }
            }
        },

        methods: {
            writingPoem() {
                if (!this.lost) {
                    if (!this.writing) {
                        if (this.fatigue < this.maxFatigue) {
                            this.writing = true;
                            this.messageArray.unshift("- You scribble furiously into your notebook...")
                        }
                        else
                            this.messageArray.unshift("- You're too tired to write.")
                    }
                    else
                        this.messageArray.unshift("- You're already writing a poem.")
                }
            },

            makePoem() {
                if (!this.lost) {
                    if (this.poemInput != "") {
                        if (this.poemInput.length >= 100) {
                            if (this.fatigue < this.maxFatigue) {
                                this.fatigue++
                                this.poems++
                                this.messageArray.unshift("- You finished your poem. You're a little more tired.")
                                this.poemArray.unshift(this.poemInput)
                                console.log(this.poemInput)
                                this.poemInput = ""
                                this.writing = false
                            }
                            else
                                this.messageArray.unshift("- You're too tired to write.")
                        }
                        else
                            this.messageArray.unshift("- Your poem is too short.")
                    }
                    else
                        this.messageArray.unshift("- No one will buy a blank poem!")
                }
            },

            sleep() {
                if (!this.lost) {
                    if (!this.writing) {
                        if (this.hunger != this.maxHunger || this.money < 10) {
                            this.fatigue = 0
                            this.hunger += this.hungerIter
                            this.day++
                            if (this.hunger > this.maxHunger) {
                                this.lost=true
                            }
                            this.messageArray.unshift("- You slept well. You're a little bit hungrier.")                
                            if (this.hunger == this.maxHunger)
                                this.messageArray.unshift("- You're feeling quite hungry. Be sure to eat today.")
                        }
                        else
                            this.messageArray.unshift("- You're too hungry to go to bed.")
                    }   
                    else
                        this.messageArray.unshift("- Finish writing your poem before you go to bed.")
                }
            },

            sellPoem() {
                if (!this.lost) {
                    if (!this.writing) {
                        if (this.fatigue < this.maxFatigue) {
                            if (this.poems >= 1) {
                                this.fatigue++
                                this.poems--
                                //this.poemArray.pop()
                                this.sellValue = Math.floor(Math.random() * this.maxSell) + this.minSell 
                                this.money += this.sellValue
                                this.messageArray.unshift("- You got $" + this.sellValue + " for your poem. Congrats! You're a little more tired.")
                            }
                            else
                                this.messageArray.unshift("- You don't have any poems to sell.")
                        }
                        else
                            this.messageArray.unshift("- You're too tired to sell any poems today.")
                    }
                    else
                        this.messageArray.unshift("- Finish writing your poem first.")
                }
            },

            autoSell() {
                if (this.poems >= 1 && !this.lost) {
                    this.fatigue--
                    this.sellPoem()
                    this.messageArray.shift() 
                    if (this.fatigue < 0)
                        this.fatigue = 0
                }
            },

            buyFood() {
                if (!this.lost) {
                    if (!this.writing) {
                        if (this.foodPrice < this.money) {
                            this.money -= this.foodPrice
                            this.hunger = 0
                            this.messageArray.unshift("- You bought some food. It was fine.")
                        }
                        else
                            this.messageArray.unshift("- You don't have enough money for food.")
                    }
                    else
                        this.messageArray.unshift("- Finish writing your poem first.")
                }
            },

            buyPoetTPG() {
                if (!this.lost) {
                    if (!this.writing) {
                        if (this.poetTPGPrice < this.money) {
                            this.money -= this.poetTPGPrice
                            this.poetTPGPrice += this.poetTPGUpgradeScale
                            this.poetTPG++
                            clearInterval(this.interval)
                            this.interval = this.intervalFunction()
                            this.automated = true
                            this.messageArray.unshift("- You bought PoetTPG. It'll write you poems now.")
                        }
                        else
                            this.messageArray.unshift("- You don't have enough money for PoetTPG.")
                    }
                    else
                        this.messageArray.unshift("- Finish writing your poem first.")
                }
            },


            upgradePoetTPG() {
                if (!this.lost) {
                    if (!this.writing) {
                        if (this.poetTPGPrice < this.money) {
                            this.money -= this.poetTPGPrice
                            this.poetTPGPrice += this.poetTPGUpgradeScale
                            this.poetTPG++
                            clearInterval(this.interval)
                            this.interval = this.intervalFunction()
                            this.messageArray.unshift("- You upgraded PoetTPG. It'll write poems faster now.")
                        }
                        else
                            this.messageArray.unshift("- You don't have enough money for PoetTPG.")
                    }
                    else
                        this.messageArray.unshift("- Finish writing your poem first.")
                }
            },
            
            buyCapitalistPTG() {
                if (!this.lost) {
                    if (!this.writing) {
                        if (this.capitalistPTGPrice < this.money) {
                            this.money -= this.capitalistPTGPrice
                            this.capitalistPTGPrice += this.capitalistPTGUpgradeScale
                            this.capitalistPTG++
                            clearInterval(this.capitalistInterval)
                            this.capitalistInterval = this.capitalistIntervalFunction()
                            if (this.capitalistAutomated)
                                this.messageArray.unshift("- You upgraded CapitalistPTG. It'll sell your poems faster now.")
                            else {
                                this.capitalistAutomated = true
                                this.messageArray.unshift("- You bought CapitalistPTG. It'll sell your poems now.")
                            }
                        }
                        else
                            this.messageArray.unshift("- You don't have enough money for CapitalistPTG.")
                    }
                    else
                        this.messageArray.unshift("- Finish writing your poem first.")
                }
            }
        },

        
        mounted() {
            this.interval = setInterval(() => {
                if (this.automated)
                    this.poems++;
                if (this.lost) {
                    this.messageArray.unshift("GAME OVER. You took \"starving artist\" a bit too literally.")
                }
            }, 1500 / this.poetTPG)
            
            this.capitalistInterval = setInterval(() => {
                if (this.capitalistPTG > 0)
                    this.autoSell()
            }, 1000 / this.capitalistPTG)
        },

        data() {
            return {
                poems: 0,
                fatigue: 0,
                maxFatigue: 5,
                hunger: 0,
                hungerIter: 1,
                maxHunger: 3,
                money: 0,
                sellValue: 0,
                maxSell: 8,
                minSell: 10,
                timer: 0,
                lost: false,
                foodPrice: 10,
                messageArray: [],
                poemInput: "",
                poemArray: [],
                writing: false,
                day: 1,
                poetTPG: 0,
                poetTPGPrice:50,
                poetTPGUpgradeScale:100,
                capitalistPTG: 0,
                capitalistPTGPrice:500,
                capitalistPTGUpgradeScale:500,
                interval: 0,
                capitalistInterval: 0,
                intervalFunction: function() {
                    interval = setInterval(() => {
                        if (this.automated)
                            this.poems++;
                        if (this.lost) {
                            this.messageArray.unshift("GAME OVER. You took \"starving artist\" a bit too literally.")
                        }
                    }, 1000 / this.poetTPG)
                    return interval
                },
                capitalistIntervalFunction: function() {
                    capitalistInterval = setInterval(() => {
                        if (this.capitalistPTG > 0)
                            this.autoSell()
                    }, 1000 / this.capitalistPTG)
                    return capitalistInterval
                },
                automated: false,
                capitalistAutomated: false
            }
        },

        el: "#app"
    })
}