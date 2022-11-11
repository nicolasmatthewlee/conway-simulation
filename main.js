main_content = document.querySelector('.main-content');

grid_object = document.createElement('div');

class GridItem {

    constructor() {

        this.object = document.createElement('button');
        this.object.setAttribute('class','grid-item');

        // must bind to access this.value in this.toggle
        this.object.addEventListener('mouseover',this.toggle.bind(this));
        this.object.addEventListener('mousedown',this.toggle_click.bind(this));

        this.value=0;

    }

    toggle() {
        if (mousedown) {
            this.object.classList.toggle('active');
            this.value=!this.value;
        }
    }

    toggle_click() {
        this.object.classList.toggle('active');
        this.value=!this.value;
    }

    update() {
        if (this.value==1) {
            this.object.classList.add('active');
        } else {
            this.object.classList.remove('active');
        }
    }

}

class Grid {

    constructor(n) {
        this.length=n;

        this.items = [];

        this.object = document.createElement('div');
        this.object.setAttribute('class','grid');

        /* must specify minimum dimension at `0px` as opposed to the default `auto` so grid can dynamically resize appropriately at smaller sizes */
        this.object.style.gridTemplate = `repeat(${n},minmax(0px,1fr)) / repeat(${n},minmax(0px,1fr))`;

        // add grid items to array
        for (let r=0;r<this.length;r++) {

            // must add array to array in for loop because fill passes the same object to all indices
            // which resulted in each row taking on the values of the last row values set
            this.items.push([]);

            for (let c=0;c<this.length;c++) {

                // must add to array in for loop because fill passes the same object to all indices
                this.items[r].push(new GridItem());
                this.object.appendChild(this.items[r][c].object);
            }
        }
    }

    simulate() {

        let sums=[];

        // for each item
        for (let x=0;x<this.length;x++) {

            sums.push([]);

            for (let y=0;y<this.length;y++) {

                // calculate sum of surrounding blocks (if they exist)
                let item_sum = 0;
                for (let dx of [-1,0,1]) {
                    for (let dy of [-1,0,1]) {
                        if (!(dx==0 && dy==0)) {
                            try {
                                item_sum+=this.items[x+dx][y+dy].value;
                            } catch {}
                        }
                    }
                }
                sums[x].push(item_sum);

            }
        }

        // must adjust values after all item sums have been calculated
        for (let x=0;x<this.length;x++) {
            for (let y=0;y<this.length;y++) {

                let item_sum=sums[x][y]

                // adjust value
                if (this.items[x][y].value==1) {
                    // conway's rules: !(item_sum==2 || item_sum==3)
                    if (!(item_sum==2 || item_sum==3)) {
                        this.items[x][y].value=0;
                        this.items[x][y].update();
                    }
                } else {
                    // conway's rules: item_sum==3
                    if (item_sum==3) {
                        this.items[x][y].value=1;
                        this.items[x][y].update();
                    }
                }
            }
        }
    }
}

// create grid
let grid = new Grid(50);
main_content.appendChild(grid.object);

// create default pattern
let x = 0;
let y = 0;
let gosper_glider_gun = [
    [x+1,y+5],
    [x+1,y+6],
    [x+2,y+5],
    [x+2,y+6],

    [x+11,y+5],
    [x+11,y+6],
    [x+11,y+7],
    [x+12,y+4],
    [x+12,y+8],
    [x+13,y+3],
    [x+13,y+9],
    [x+14,y+3],
    [x+14,y+9],
    [x+15,y+6],
    [x+16,y+4],
    [x+16,y+8],
    [x+17,y+5],
    [x+17,y+6],
    [x+17,y+7],
    [x+18,y+6],

    [x+21,y+3],
    [x+21,y+4],
    [x+21,y+5],
    [x+22,y+3],
    [x+22,y+4],
    [x+22,y+5],
    [x+23,y+2],
    [x+23,y+6],
    [x+25,y+1],
    [x+25,y+2],
    [x+25,y+6],
    [x+25,y+7],

    [x+35,y+3],
    [x+35,y+4],
    [x+36,y+3],
    [x+36,y+4]
]

for (let xy of gosper_glider_gun) {
    grid.items[xy[1]][xy[0]].value=1;
    grid.items[xy[1]][xy[0]].update();
}

// listen for mousedown to allow for dragging
let mousedown = false;
addEventListener('mousedown', () => mousedown=true);
addEventListener('mouseup', () => mousedown=false);

// play button
let timer_id=0;

let play_button = document.createElement('button');
play_button.textContent='run';
play_button.setAttribute('class','play-button');
play_button.addEventListener('click',()=> {

    play_button.classList.toggle('active');

    if (play_button.classList.contains('active')) {
        play_button.textContent='pause';
        // must call grid.simulate() so that `this` references grid
        timer_id = setInterval(()=>grid.simulate(),100);
    } else {
        play_button.textContent='run';
        clearInterval(timer_id);
    }

});
    
main_content.appendChild(play_button);