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

}

class Grid {

    constructor(n) {
        this.length=n;

        this.items = [];

        this.object = document.createElement('div');
        this.object.setAttribute('class','grid');
        this.object.style.gridTemplate = `repeat(${n},1fr) / repeat(${n},1fr)`;

        // add Block objects to array
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
}

let grid = new Grid(4);
body.appendChild(grid.object);