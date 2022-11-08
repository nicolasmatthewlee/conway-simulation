body = document.querySelector('body');

grid_object = document.createElement('div');

class GridItem {

    constructor() {

        this.object = document.createElement('button');
        this.object.setAttribute('class','grid-item');

        // must bind to access this.value in this.toggle
        this.object.addEventListener('click',this.toggle.bind(this));

        this.value=0;

    }

    toggle() {
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
        this.object.style.gridTemplate = `repeat(${n},1fr) / repeat(${n},1fr)`;

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
                    if (!(item_sum==2 || item_sum==3)) {
                        this.items[x][y].value=0;
                        this.items[x][y].update();
                    }
                } else {
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
let grid = new Grid(3);
body.appendChild(grid.object);

// simulate every second
// must call grid.simulate() so that `this` references grid
//setInterval(()=>grid.simulate(),2000);

let play_button = document.createElement('button');
play_button.setAttribute('class','play-button');
play_button.addEventListener('click',()=>grid.simulate())
body.appendChild(play_button)