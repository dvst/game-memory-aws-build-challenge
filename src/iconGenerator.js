// Generador de iconos SVG para servicios AWS
class AWSIconGenerator {
    static generateServiceIcon(serviceName, size = 64) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Fondo del icono
        ctx.fillStyle = '#FF9900';
        ctx.fillRect(0, 0, size, size);
        
        // Borde
        ctx.strokeStyle = '#232F3E';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, size, size);
        
        // Texto del servicio
        ctx.fillStyle = '#232F3E';
        ctx.font = `bold ${size/4}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Iconos específicos por servicio
        switch(serviceName.toLowerCase()) {
            case 's3':
                this.drawS3Icon(ctx, size);
                break;
            case 'lambda':
                this.drawLambdaIcon(ctx, size);
                break;
            case 'ec2':
                this.drawEC2Icon(ctx, size);
                break;
            case 'rds':
                this.drawRDSIcon(ctx, size);
                break;
            case 'eks':
                this.drawEKSIcon(ctx, size);
                break;
            case 'sagemaker':
                this.drawSageMakerIcon(ctx, size);
                break;
            case 'kinesis':
                this.drawKinesisIcon(ctx, size);
                break;
            case 'redshift':
                this.drawRedshiftIcon(ctx, size);
                break;
            default:
                ctx.fillText(serviceName, size/2, size/2);
        }
        
        return canvas.toDataURL();
    }
    
    static drawS3Icon(ctx, size) {
        // Dibujar bucket
        ctx.fillStyle = '#232F3E';
        ctx.fillRect(size/4, size/3, size/2, size/3);
        ctx.fillText('S3', size/2, size*0.8);
    }
    
    static drawLambdaIcon(ctx, size) {
        // Dibujar lambda
        ctx.fillStyle = '#232F3E';
        ctx.font = `bold ${size/2}px monospace`;
        ctx.fillText('λ', size/2, size/2);
        ctx.font = `bold ${size/6}px monospace`;
        ctx.fillText('Lambda', size/2, size*0.8);
    }
    
    static drawEC2Icon(ctx, size) {
        // Dibujar servidor
        ctx.fillStyle = '#232F3E';
        ctx.fillRect(size/4, size/4, size/2, size/2);
        ctx.fillText('EC2', size/2, size*0.8);
    }
    
    static drawRDSIcon(ctx, size) {
        // Dibujar base de datos
        ctx.fillStyle = '#232F3E';
        ctx.beginPath();
        ctx.ellipse(size/2, size/3, size/3, size/8, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillRect(size/6, size/3, size*2/3, size/4);
        ctx.fillText('RDS', size/2, size*0.8);
    }
    
    static drawEKSIcon(ctx, size) {
        // Dibujar Kubernetes wheel
        ctx.fillStyle = '#232F3E';
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillText('EKS', size/2, size*0.8);
    }
    
    static drawSageMakerIcon(ctx, size) {
        // Dibujar cerebro/ML
        ctx.fillStyle = '#232F3E';
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText('ML', size/2, size*0.8);
    }
    
    static drawKinesisIcon(ctx, size) {
        // Dibujar stream
        ctx.fillStyle = '#232F3E';
        ctx.beginPath();
        ctx.moveTo(size/4, size/2);
        ctx.quadraticCurveTo(size/2, size/4, size*3/4, size/2);
        ctx.quadraticCurveTo(size/2, size*3/4, size/4, size/2);
        ctx.stroke();
        ctx.fillText('Stream', size/2, size*0.8);
    }
    
    static drawRedshiftIcon(ctx, size) {
        // Dibujar data warehouse
        ctx.fillStyle = '#232F3E';
        ctx.fillRect(size/4, size/4, size/2, size/8);
        ctx.fillRect(size/4, size/2.5, size/2, size/8);
        ctx.fillRect(size/4, size/1.6, size/2, size/8);
        ctx.fillText('DW', size/2, size*0.8);
    }
}
