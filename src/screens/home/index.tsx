import { ColorSwatch, Group } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import {SWATCHES} from '@/constants';
// import {LazyBrush} from 'lazy-brush';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


interface GeneratedResult {
    expression: string;
    answer: string;
}

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface APIError {
    message: string;
    error: string;
    detail?: string;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [isLoading, setIsLoading] = useState(false);

    // const lazyBrush = new LazyBrush({
    //     radius: 10,
    //     enabled: true,
    //     initialPoint: { x: 0, y: 0 },
    // });
    const handleAPIError = (error: APIError) => {
        console.error('API Error:', error);
        
        let errorMessage = 'An unexpected error occurred';
        
        if (axios.isAxiosError(error)) {
            // Handle Axios error responses
            if (error.response) {
                const data = error.response.data as APIError;
                
                if (error.response.status === 500) {
                    if (error.response.data.detail?.includes('UnboundLocalError: local variable')) {
                        errorMessage = 'Unable to process the mathematical expression. Please make sure your drawing is clear and try again.';
                    } else {
                        errorMessage = 'Server error occurred. Please try again later.';
                    }
                } else {
                    errorMessage = data.message || data.error || 'An error occurred while processing your request';
                }
            } else if (error.request) {
                errorMessage = 'Unable to reach the server. Please check your internet connection.';
            }
        }
        
        toast.error('Error', {
            description: errorMessage,
            duration: 5000,
        });
    };
    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;
    
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
            }

        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
            });
        };

        return () => {
            document.head.removeChild(script);
        };

    }, []);

    const renderLatexToCanvas = (expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression([...latexExpression, latex]);

        // Clear the main canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };


    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    };
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };
    const stopDrawing = () => {
        setIsDrawing(false);
    };  

    const runRoute = async () => {
        const canvas = canvasRef.current;
    
        if (canvas) {
            setIsLoading(true);
            try {
                const response = await axios({
                    method: 'post',
                    url: `${import.meta.env.VITE_API_URL}/calculate`,
                    data: {
                        image: canvas.toDataURL('image/png'),
                        dict_of_vars: dictOfVars
                    }
                });

                const resp = await response.data;
                console.log('Response', resp);
                
                if (!resp.data || resp.data.length === 0) {
                    toast.warning('No expression detected', {
                        description: 'Please draw a clear mathematical expression and try again.',
                        duration: 4000,
                    });
                    return;
                }

                resp.data.forEach((data: Response) => {
                    if (data.assign === true) {
                        setDictOfVars({
                            ...dictOfVars,
                            [data.expr]: data.result
                        });
                    }
                });

                const ctx = canvas.getContext('2d');
                const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
                let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const i = (y * canvas.width + x) * 4;
                        if (imageData.data[i + 3] > 0) {
                            minX = Math.min(minX, x);
                            minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x);
                            maxY = Math.max(maxY, y);
                        }
                    }
                }

                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                setLatexPosition({ x: centerX, y: centerY });
                
                resp.data.forEach((data: Response) => {
                    setTimeout(() => {
                        setResult({
                            expression: data.expr,
                            answer: data.result
                        });
                    }, 1000);
                });

                toast.success('Success', {
                    description: 'Expression processed successfully!',
                    duration: 2000,
                });

            } catch (error) {
                handleAPIError(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-black" />
                        <p className="text-black font-medium">Processing your expression...</p>
                    </div>
                </div>
            )}
            
            <div className='grid grid-cols-3 gap-2'>
                <Button
                    onClick={() => setReset(true)}
                    className='z-20 bg-black text-white'
                    variant='default' 
                    color='black'
                    disabled={isLoading}
                >
                    Reset
                </Button>
                <Group className='z-20'>
                    {SWATCHES.map((swatch) => (
                        <ColorSwatch 
                            key={swatch} 
                            color={swatch} 
                            onClick={() => !isLoading && setColor(swatch)}
                            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                        />
                    ))}
                </Group>
                <Button
                    onClick={runRoute}
                    className='z-20 bg-black text-white'
                    variant='default'
                    color='white'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                        </div>
                    ) : (
                        'Run'
                    )}
                </Button>
            </div>

            <canvas
                ref={canvasRef}
                id='canvas'
                className='absolute top-0 left-0 w-full h-full overflow-auto'
                onMouseDown={!isLoading ? startDrawing : undefined}
                onMouseMove={!isLoading ? draw : undefined}
                onMouseUp={!isLoading ? stopDrawing : undefined}
                onMouseOut={!isLoading ? stopDrawing : undefined}
                style={{ 
                    cursor: isLoading ? 'not-allowed' : 'crosshair',
                    opacity: isLoading ? 0.7 : 1 
                }}
            />

            {latexExpression && latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPosition}
                    onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
                    disabled={isLoading}
                >
                    <div className="absolute p-2 text-white rounded shadow-md">
                        <div className="latex-content">{latex}</div>
                    </div>
                </Draggable>
            ))}
        </>
    );
}