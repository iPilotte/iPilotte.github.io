var UIController = function() {

    var DOMstrings = {
        startBtn : '.start_btn',
        box : '.box',
        gameStatus: '.game-status',
        moveCounter : 'counter',
    }
    
    return {
        assignValueToBox : function(boxValue){
        
            //NodeLists
            var boxes = document.querySelectorAll(DOMstrings.box)
            var x = 0
            var y = 0
            boxes.forEach(function(box){
                boxValue[x][y] !== 16 ? box.textContent = boxValue[x][y] : box.textContent = ' '
                if(y === 3){
                    y=-1
                    x++
                }
                y++
            })
        },

        renderMoveCounter : function (counter){
            document.getElementById(DOMstrings.moveCounter).textContent = counter
        },

        renderStatus : function (status){
            document.querySelector(DOMstrings.gameStatus).textContent = status
        },

        renderSwpBox : function (pos,newPos){
            var temp
            temp = document.querySelector(DOMstrings.box+''+pos).textContent
            document.querySelector(DOMstrings.box+''+pos).textContent = document.querySelector(DOMstrings.box+''+newPos).textContent
            temp = document.querySelector(DOMstrings.box+''+newPos).textContent = temp
        },

        getDOMstrings: function() {
            return DOMstrings
        }
    }
}()

var gameController = function() {
    var board = {
        boxesValue : [],
        moveCounter: 0,
        playing: false
    }

    var isSpaceNearby = function(row,col){
        if( board.boxesValue[row-1] !== undefined && board.boxesValue[row-1][col] === 16 ) return 'w'
        if( board.boxesValue[col-1] !== undefined && board.boxesValue[row][col-1] === 16 ) return 'a'
        if( board.boxesValue[row+1] !== undefined && board.boxesValue[row+1][col] === 16 ) return 's'
        if( board.boxesValue[col+1] !== undefined && board.boxesValue[row][col+1] === 16 ) return 'd'

        return false
    }

    var swapValueinBox = function(x,y,direction){
        var temp
        switch(direction){
            case 'w':
                temp = board.boxesValue[x-1][y]
                board.boxesValue[x-1][y] = board.boxesValue[x][y]
                board.boxesValue[x][y] = temp
                return [x-1,y]
                break;
            case 'a':
                temp = board.boxesValue[x][y-1]
                board.boxesValue[x][y-1] = board.boxesValue[x][y]
                board.boxesValue[x][y] = temp
                return [x,y-1]
                break;
            case 's':
                temp = board.boxesValue[x+1][y]
                board.boxesValue[x+1][y] = board.boxesValue[x][y]
                board.boxesValue[x][y] = temp
                return [x+1,y]
                break;
            case 'd':
                temp = board.boxesValue[x][y+1]
                board.boxesValue[x][y+1] = board.boxesValue[x][y]
                board.boxesValue[x][y] = temp
                return [x,y+1]
                break;
        }
    }

    var change2DposToNum = function(x,y,limit = 4){
        var num = ((x*limit) + y) + 1
        return num
    }

    var changeNumTo2Dpos = function(num,limit = 4){
        var row,col
        if(num%limit === 0){
            row = Math.floor(num/limit) - 1
            col = limit - 1
        }else{
            row = Math.floor(num/limit)
            col = (num - (row*limit)) - 1
        }
        var position = [row,col]
        return position
    }

    return {
        startGame: function(boxesValue){
            board.playing = true
            board.moveCounter = 0
            board.boxesValue = boxesValue
        },

        getBoxesValue: function() {
            return board.boxesValue
        },

        getMoveCount: function() {
            return board.moveCounter
        },

        getBoardStatus: function() {
            return board.playing
        },



        swapBox: function(position){
            var position = changeNumTo2Dpos(position,4)
            var direction = isSpaceNearby(position[0],position[1])
            if(direction !== false){
                var new2Dpos = swapValueinBox(position[0],position[1],direction)
                var newPos = change2DposToNum(new2Dpos[0], new2Dpos[1])
                board.moveCounter++;
                return newPos
            }
            return false
        },

        checkCompletion : function(){
            var counter
            counter = 1
            for(var x=0,y=0 ; x <= 3; y++){
                if(board.boxesValue[x][y] === counter){
                    if(y === 3){
                        y=-1
                        x++
                    }
                    counter++
                }else{
                    return false
                }
            }
            board.playing = false
            return true
        }

    }
}()

var controller = function(UIctrl,gameCtrl){

    var DOM = UIctrl.getDOMstrings()

    var setupEventListeners = function(){
        document.querySelector(DOM.startBtn).addEventListener('click', ctrlStartGame)
        document.querySelector(DOM.box+'1').addEventListener('click', function(){ ctrlMoveBox(1) })
        document.querySelector(DOM.box+'2').addEventListener('click', function(){ ctrlMoveBox(2) })
        document.querySelector(DOM.box+'3').addEventListener('click', function(){ ctrlMoveBox(3) })
        document.querySelector(DOM.box+'4').addEventListener('click', function(){ ctrlMoveBox(4) })
        document.querySelector(DOM.box+'5').addEventListener('click', function(){ ctrlMoveBox(5) })
        document.querySelector(DOM.box+'6').addEventListener('click', function(){ ctrlMoveBox(6) })
        document.querySelector(DOM.box+'7').addEventListener('click', function(){ ctrlMoveBox(7) })
        document.querySelector(DOM.box+'8').addEventListener('click', function(){ ctrlMoveBox(8) })
        document.querySelector(DOM.box+'9').addEventListener('click', function(){ ctrlMoveBox(9) })
        document.querySelector(DOM.box+'10').addEventListener('click', function(){ ctrlMoveBox(10) })
        document.querySelector(DOM.box+'11').addEventListener('click', function(){ ctrlMoveBox(11) })
        document.querySelector(DOM.box+'12').addEventListener('click', function(){ ctrlMoveBox(12) })
        document.querySelector(DOM.box+'13').addEventListener('click', function(){ ctrlMoveBox(13) })
        document.querySelector(DOM.box+'14').addEventListener('click', function(){ ctrlMoveBox(14) })
        document.querySelector(DOM.box+'15').addEventListener('click', function(){ ctrlMoveBox(15) })
        document.querySelector(DOM.box+'16').addEventListener('click', function(){ ctrlMoveBox(16) })
        
    }

    var ctrlMoveBox = function(position){
        if(gameCtrl.getBoardStatus()){
            var newPosition = gameCtrl.swapBox(position)
            if(newPosition !== false){
                UIctrl.renderSwpBox(position,newPosition)
                UIctrl.renderMoveCounter(gameCtrl.getMoveCount())
                if(gameCtrl.checkCompletion()){
                    UIctrl.renderStatus('good game well played!!')
                }
            }
        }
    }

    var ctrlStartGame = function(){
        //random board
        //var numList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]
        var boxValue = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]
        
        var direction = [[-1,0],[0,-1],[1,0],[0,1]]
        //Shuffle

        var temp,rand,round,spaceLoc,nextSpaceLoc,lastRand
        lastRand = [0,0]
        spaceLoc = [3,3]
        round = Math.floor(Math.random()*100)+20
        for(var i = 0; i < round; i++){
            do{
                rand = direction[Math.floor(Math.random()*4)]
                nextSpaceLoc = [rand[0]+spaceLoc[0],rand[1]+spaceLoc[1]]
            }while(rand[0]+lastRand[0] == 0 && rand[1]+lastRand[1] == 0)
            if((nextSpaceLoc[0] >= 0 && nextSpaceLoc[0] <= 3) && (nextSpaceLoc[1] >= 0 && nextSpaceLoc[1] <= 3)){
                lastRand = rand
                temp = boxValue[nextSpaceLoc[0]][nextSpaceLoc[1]]
                boxValue[nextSpaceLoc[0]][nextSpaceLoc[1]] = boxValue[spaceLoc[0]][spaceLoc[1]]
                boxValue[spaceLoc[0]][spaceLoc[1]] = temp
                spaceLoc = nextSpaceLoc
            }
        }
        UIctrl.assignValueToBox(boxValue)
        UIctrl.renderStatus('playing')
        gameCtrl.startGame(boxValue)
        UIctrl.renderMoveCounter(gameCtrl.getMoveCount())
    }

    return {
        init: function() {
            setupEventListeners()
        }
    }

}(UIController, gameController)


controller.init()