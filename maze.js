// Maze generation and rendering
class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cellSize = 20;
        this.grid = [];
        this.generate();
    }

    generate() {
        // Initialize grid with walls
        this.grid = Array(this.height).fill().map(() => Array(this.width).fill(1));
        
        // Create maze using recursive backtracking
        const stack = [];
        const startX = 1;
        const startY = 1;
        
        this.grid[startY][startX] = 0;
        stack.push({x: startX, y: startY});
        
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(current.x, current.y);
            
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                
                // Remove wall between current and next
                const wallX = current.x + (next.x - current.x) / 2;
                const wallY = current.y + (next.y - current.y) / 2;
                this.grid[wallY][wallX] = 0;
                this.grid[next.y][next.x] = 0;
                
                stack.push(next);
            } else {
                stack.pop();
            }
        }
        
        // Ensure there's always a path to the goal
        this.ensurePathToGoal();
    }

    getUnvisitedNeighbors(x, y) {
        const neighbors = [];
        const directions = [
            {dx: 0, dy: -2}, // up
            {dx: 2, dy: 0},  // right
            {dx: 0, dy: 2},  // down
            {dx: -2, dy: 0}  // left
        ];
        
        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            
            if (nx > 0 && nx < this.width - 1 && ny > 0 && ny < this.height - 1) {
                if (this.grid[ny][nx] === 1) {
                    neighbors.push({x: nx, y: ny});
                }
            }
        }
        
        return neighbors;
    }

    ensurePathToGoal() {
        // Make sure the goal area is accessible
        const goalX = this.width - 2;
        const goalY = this.height - 2;
        
        // Clear the goal area
        for (let y = goalY - 1; y <= goalY; y++) {
            for (let x = goalX - 1; x <= goalX; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.grid[y][x] = 0;
                }
            }
        }
    }

    render(ctx, offsetX = 0, offsetY = 0) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const drawX = x * this.cellSize + offsetX;
                const drawY = y * this.cellSize + offsetY;
                
                if (this.grid[y][x] === 1) {
                    // Wall - space marine metallic style
                    const gradient = ctx.createLinearGradient(drawX, drawY, drawX + this.cellSize, drawY + this.cellSize);
                    gradient.addColorStop(0, '#4a5568');
                    gradient.addColorStop(0.5, '#2d3748');
                    gradient.addColorStop(1, '#1a202c');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(drawX, drawY, this.cellSize, this.cellSize);
                    
                    // Add metallic border effect
                    ctx.strokeStyle = '#718096';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(drawX, drawY, this.cellSize, this.cellSize);
                } else {
                    // Floor - dark space
                    ctx.fillStyle = '#000010';
                    ctx.fillRect(drawX, drawY, this.cellSize, this.cellSize);
                }
            }
        }
        
        // Render goal zone (red extraction zone)
        this.renderGoalZone(ctx, offsetX, offsetY);
    }

    renderGoalZone(ctx, offsetX, offsetY) {
        const goalX = (this.width - 2) * this.cellSize + offsetX;
        const goalY = (this.height - 2) * this.cellSize + offsetY;
        const goalSize = this.cellSize * 2;
        
        // Animated pulsing red zone
        const time = Date.now() / 1000;
        const alpha = 0.3 + 0.3 * Math.sin(time * 3);
        
        // Outer glow
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.fillRect(goalX - this.cellSize, goalY - this.cellSize, goalSize * 2, goalSize * 2);
        
        // Inner bright zone
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(255, 50, 50, ${alpha + 0.2})`;
        ctx.fillRect(goalX, goalY, goalSize, goalSize);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Goal zone border
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.strokeRect(goalX, goalY, goalSize, goalSize);
    }

    isWall(x, y) {
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
            return true;
        }
        
        return this.grid[gridY][gridX] === 1;
    }

    isInGoalZone(x, y) {
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        return gridX >= this.width - 2 && gridY >= this.height - 2;
    }
}