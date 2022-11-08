body = document.querySelector('body');

grid_object = document.createElement('div');

class Grid {
    constructor(n) {
        this.length=n;
        this.values = Array(n).fill(Array(n).fill(0));

        this.object = document.createElement('div');
        this.object.setAttribute('class','grid');
        this.object.style.gridTemplate = `repeat(${n},1fr) / repeat(${n},1fr)`;
    }

    display() {

        // clear grid
        this.object.innerHTML="";

        // redraw
        for (let r=0;r<this.length;r++) {

            for (let c=0;c<this.length;c++) {

                let grid_item = document.createElement('div');
                grid_item.setAttribute('class','grid-item');

                if (this.values[r][c] == 1) {
                    grid_item.classList.add('active');
                }

                this.object.appendChild(grid_item);

                console.log(this.values[r][c]);

            }
        }
    }
}

let grid = new Grid(5)
grid.display()

body.appendChild(grid.object);