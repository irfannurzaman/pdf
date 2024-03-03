// lanczosFilter.js
import { fabric } from 'fabric';
import React, { useEffect, useRef } from 'react';
fabric.Image.filters.LanczosFilter = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

    type: 'LanczosFilter',

    initialize: function(options) {
        options = options || {};
        this.lanczosLobes = options.lanczosLobes || 3;
        this.taps = options.taps || [];
    },

    applyTo: function(options) {
        var imageData = options.imageData;
        var data = imageData.data,
            width = imageData.width,
            height = imageData.height,
            imageDataCopy = new Uint8ClampedArray(data),
            l = this.lanczosLobes,
            m = this.taps.length,
            r, g, b, a, x, y, i, j, coef;

        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = 0;
                for (i = 0; i < l; i++) {
                    for (j = 0; j < m; j++) {
                        coef = this.taps[j];
                        if (coef) {
                            var idx = ((y * width + x) * 4);
                            idx -= (m / 2 - j) * 4;
                            if (idx < 0 || idx >= imageDataCopy.length) {
                                continue;
                            }
                            r += imageDataCopy[idx++] * coef;
                            g += imageDataCopy[idx++] * coef;
                            b += imageDataCopy[idx++] * coef;
                            a += imageDataCopy[idx] * coef;
                        }
                    }
                }
                var idx = (y * width + x) * 4;
                data[idx++] = r;
                data[idx++] = g;
                data[idx++] = b;
                data[idx] = a;
            }
        }
    },
});

fabric.Image.filters.LanczosFilter.fromObject = function(object) {
    return new fabric.Image.filters.LanczosFilter(object);
};


const FabricComponent = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 600
        });
      
      
      
      fabric.Image.fromURL('../public/logo512.png', function(img) {
    img.set({
        left: 0,
        top: 0,
        scaleX: 0.2,
        scaleY: 0.2
    });

    // Wait for the image to load
    img.getElement().onload = function() {
        // Apply Lanczos filter
        img.filters.push(new fabric.Image.filters.LanczosFilter({
            lanczosLobes: 3, // Adjust as needed
            taps: [/* Add your Lanczos coefficients */]
        }));

        img.applyFilters();
        canvas.add(img);
    };
});

  

        return () => {
            canvas.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default FabricComponent;