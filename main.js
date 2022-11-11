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

    create_gosper_glider_gun(x=0,y=0,r=0) {
        // r specifies the number of clockwise rotations

        let coordinates = [
            [1,5],
            [1,6],
            [2,5],
            [2,6],

            [11,5],
            [11,6],
            [11,7],
            [12,4],
            [12,8],
            [13,3],
            [13,9],
            [14,3],
            [14,9],
            [15,6],
            [16,4],
            [16,8],
            [17,5],
            [17,6],
            [17,7],
            [18,6],

            [21,3],
            [21,4],
            [21,5],
            [22,3],
            [22,4],
            [22,5],
            [23,2],
            [23,6],
            [25,1],
            [25,2],
            [25,6],
            [25,7],

            [35,3],
            [35,4],
            [36,3],
            [36,4]
        ]

        for (let xy of coordinates) {

            let transformed_x = xy[0];
            let transformed_y = xy[1];

            for(let n=r;n>0;n--) {
                let placeholder = transformed_x;

                transformed_x = -1*transformed_y;
                transformed_y = placeholder;
            }

            transformed_x += x;
            transformed_y += y;

            this.items[transformed_y][transformed_x].value=1;
            this.items[transformed_y][transformed_x].update();
        }

    }

    create_absorber(x=0,y=0,r=0) {
        
        let coordinates = [
            [0,0],
            [0,1],
            [1,0],
            [2,1],
            [2,2],
            [2,3],
            [3,3]
        ]

        for (let xy of coordinates) {

            let transformed_x = xy[0];
            let transformed_y = xy[1];

            for(let n=r;n>0;n--) {
                let placeholder = transformed_x;

                transformed_x = -1*transformed_y;
                transformed_y = placeholder;
            }

            transformed_x += x;
            transformed_y += y;

            this.items[transformed_y][transformed_x].value=1;
            this.items[transformed_y][transformed_x].update();
        }
    }

    pattern_1() {
        this.create_gosper_glider_gun(0,0);
        this.create_gosper_glider_gun(69,0,1);
        this.create_gosper_glider_gun(69,69,2);
        this.create_gosper_glider_gun(0,69,3);

        this.create_gosper_glider_gun(26,50,1);
        this.create_gosper_glider_gun(50,43);
        this.create_gosper_glider_gun(72,37,3);
        this.create_gosper_glider_gun(50,70);
    }

    pattern_2() {
        this.create_gosper_glider_gun(12,24);
        this.create_gosper_glider_gun(68,8,1);
        this.create_gosper_glider_gun(79,64,2);
        this.create_gosper_glider_gun(22,81,3);
        
        this.create_gosper_glider_gun(39,25,2);
        this.create_gosper_glider_gun(60,12,2);

        this.create_gosper_glider_gun(71,39,3);

        this.create_gosper_glider_gun(51,65);

        this.create_gosper_glider_gun(20,35,1);
    }

    pattern_3() {
        this.create_gosper_glider_gun();
        this.create_gosper_glider_gun(0,71,3);
        this.create_gosper_glider_gun(24,52,1);
        this.create_absorber(40,26,0);

        this.create_gosper_glider_gun(66,0,1);
        this.create_absorber(30,50,1);

        this.create_gosper_glider_gun(34,89,3);
        this.create_gosper_glider_gun(63,89,3);

        this.create_gosper_glider_gun(89,5,1);
    }
}

// create grid
let grid = new Grid(90);
main_content.appendChild(grid.object);

// load random default pattern
switch(Math.floor(Math.random()*3)) {
    case 0: grid.pattern_1(); break;
    case 1: grid.pattern_2(); break;
    case 2: grid.pattern_3(); break;
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
        timer_id = setInterval(()=>grid.simulate(),50);
    } else {
        play_button.textContent='run';
        clearInterval(timer_id);
    }

});
    
main_content.appendChild(play_button);