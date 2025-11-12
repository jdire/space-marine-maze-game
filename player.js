// Player character - Space Marine
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 16;
        this.speed = 4;
        this.direction = 0; // 0: up, 1: right, 2: down, 3: left
        this.animationFrame = 0;
        this.lastMoveTime = 0;
    }

    update() {
        // Simple animation
        if (Date.now() - this.lastMoveTime > 100) {
            this.animationFrame++;
        }
    }

    move(dx, dy, maze) {
        const newX = this.x + dx * this.speed;
        const newY = this.y + dy * this.speed;
        
        // Check collision with walls
        const corners = [
            {x: newX - this.size/2, y: newY - this.size/2}, // top-left
            {x: newX + this.size/2, y: newY - this.size/2}, // top-right
            {x: newX - this.size/2, y: newY + this.size/2}, // bottom-left
            {x: newX + this.size/2, y: newY + this.size/2}  // bottom-right
        ];
        
        let canMoveX = true;
        let canMoveY = true;
        
        // Check X movement
        for (const corner of corners) {
            if (maze.isWall(corner.x, this.y)) {
                canMoveX = false;
                break;
            }
        }
        
        // Check Y movement
        for (const corner of corners) {
            if (maze.isWall(this.x, corner.y)) {
                canMoveY = false;
                break;
            }
        }
        
        if (canMoveX) {
            this.x = newX;
        }
        if (canMoveY) {
            this.y = newY;
        }
        
        // Update direction and animation
        if (dx !== 0 || dy !== 0) {
            this.lastMoveTime = Date.now();
            if (dx > 0) this.direction = 1;
            else if (dx < 0) this.direction = 3;
            else if (dy > 0) this.direction = 2;
            else if (dy < 0) this.direction = 0;
            
            // Return true if actually moved for sound effect
            return (canMoveX || canMoveY);
        }
        
        return false;
    }

    render(ctx, offsetX = 0, offsetY = 0) {
        const drawX = this.x + offsetX;
        const drawY = this.y + offsetY;
        
        ctx.save();
        ctx.translate(drawX, drawY);
        
        // Space Marine body (main armor)
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#0066cc');
        gradient.addColorStop(0.7, '#003d7a');
        gradient.addColorStop(1, '#001f3d');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Armor highlights
        ctx.strokeStyle = '#00aaff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Helmet visor
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(0, -2, this.size/4, 0, Math.PI * 2);
        ctx.fill();
        
        // Direction indicator (weapon/facing)
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        switch(this.direction) {
            case 0: // up
                ctx.moveTo(0, -this.size/2);
                ctx.lineTo(0, -this.size);
                break;
            case 1: // right
                ctx.moveTo(this.size/2, 0);
                ctx.lineTo(this.size, 0);
                break;
            case 2: // down
                ctx.moveTo(0, this.size/2);
                ctx.lineTo(0, this.size);
                break;
            case 3: // left
                ctx.moveTo(-this.size/2, 0);
                ctx.lineTo(-this.size, 0);
                break;
        }
        ctx.stroke();
        
        // Power core glow effect
        const time = Date.now() / 1000;
        const glowAlpha = 0.3 + 0.2 * Math.sin(time * 4);
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(0, 255, 255, ${glowAlpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    checkGoalReached(maze) {
        return maze.isInGoalZone(this.x, this.y);
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.direction = 0;
        this.animationFrame = 0;
    }
}