import { useAnimation, motion } from 'framer-motion';
// @ts-ignore
import { useInView } from 'react-intersection-observer';

import React, { useEffect } from 'react';

const SPEED_FACTOR = 0.5;
const pulseDuration = 1.5;

const LoaderSVG: React.FC = () => {
  const controlsCircle = useAnimation();
  const controlsDog = useAnimation();
  const controlsPulse = useAnimation();
  const [ref, inView] = useInView();

  async function sequence() {
    await controlsCircle.start({
      fill: '#8bf98e',
      transition: {
        duration: 0.8 * SPEED_FACTOR,
        ease: 'easeInOut',
      },
    });

    await controlsDog.start({
      pathLength: 1,
      transition: {
        duration: 2 * SPEED_FACTOR,
        ease: 'easeInOut',
      },
    });
    await controlsDog.start({
      fill: '#000000',
      transition: {
        duration: 1 * SPEED_FACTOR,
        ease: 'easeInOut',
      },
    });

    controlsPulse.start({
      scale: [0.5, 1],
      opacity: [0, 0.8, 0],
      fill: ['rgba(0,0,0,0)', '#8bf98e'],
      transition: {
        duration: pulseDuration,
        repeat: Infinity,
        // times: [0, 0.8, 1],
        ease: 'linear',
      },
    });
  }

  useEffect(() => {
    if (inView && controlsCircle && controlsDog && controlsPulse) {
      sequence();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlsCircle, controlsDog, inView, controlsPulse]);

  return (
    <div className="w-1/6 lg:w-1/12 h-auto flex flex-col items-center">
      <motion.svg
        ref={ref}
        width="100%"
        height="auto"
        viewBox="0 0 511 515"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink">
        <motion.g id="Group-copy-3">
          <motion.path
            id="Ellipse"
            // fill="#8bf98e"
            fillRule="evenodd"
            stroke="none"
            d="M 511 255.5 C 511 114.391235 396.608765 0 255.5 0 C 114.391243 0 0 114.391235 0 255.5 C 0 396.608765 114.391243 511 255.5 511 C 396.608765 511 511 396.608765 511 255.5 Z"
            animate={controlsCircle}
            initial={{ fill: 'rgba(0,0,0,0)' }}
          />
          <motion.path
            id="Path"
            stroke="#000000"
            fillRule="evenodd"
            d="M 111 466 C 111 466 109.810791 442.743835 112 431 C 114.903992 415.421875 120.75885 400.485565 124 385 C 126.75885 371.818909 130 345 130 345 C 130 345 130.699463 322.570129 135 312 C 137.060303 306.936035 141.757446 302.464539 144 297 C 147.312195 288.929016 142.656921 278.566284 147 271 C 150.318787 265.21814 157.279053 265.374634 163 259 C 163.276978 258.691406 161.094971 256.809387 161 254 C 160.951111 252.552673 162.896362 250.944092 163 249 C 163.566162 238.381226 162.810852 231.412109 165 223 C 167.403931 213.762451 177 197 177 197 C 177 197 184.245178 184.421448 189 179 C 191.336426 176.335999 195.478455 175.200073 197 172 C 201.010315 163.565552 196.539734 153.224426 198 144 C 199.138306 136.809448 204 123 204 123 L 207 110 L 220 77 L 232 57 L 241 41 C 241 41 245.167847 27.353882 251 25 C 253.54895 23.971252 256.916382 25.207275 259 27 C 268.854492 35.478699 274 63 274 63 C 274 63 276.241943 79.961609 279 88 C 281.177002 94.345093 288 106 288 106 C 288 106 288.420044 114.783813 291 118 C 294.264771 122.069885 299.78479 124.846741 305 125 C 307.537476 125.074585 309.767822 123.209167 312 122 C 317.283813 119.137756 322.507202 115.990784 327 112 C 333.570679 106.163391 339.977539 99.028564 345 91 C 348.490234 85.420776 350.737305 80.616394 356 78 C 359.606567 76.20697 361 89 361 89 C 361 89 360.839233 108.600647 360 118 C 359.172607 127.267273 356 145 356 145 L 355 153 C 355 153 356.650146 165.052063 357 171 C 357.316772 176.385437 357 187 357 187 C 357 187 356.985474 187.445374 356.996582 188.124329 C 357.022217 189.708557 357.187134 192.564209 358 194 C 361.656616 200.458252 370.224609 205.861023 378 212 C 391.822998 222.913696 406 233 406 233 C 406 233 409.026001 236.764099 409 239 C 408.961426 242.308228 405.125977 244.063843 404 247 C 403.410767 248.536499 403.507324 251.349365 403.146484 251.862488 C 401.428101 254.305847 400 256 400 256 C 400 256 396.9552 260.902527 395 263 C 388.21936 270.274109 381.25769 278.369141 372 282 C 367.104492 283.920044 358.853882 283.924133 352 284 C 343.623047 284.092773 341.632324 280.563904 338 284 C 335.991821 285.899658 338.045044 290.276306 338 294 C 337.947144 298.371277 336.184448 299.257446 336 302 C 335.797485 305.011658 338.155151 308.211304 337 311 C 335.366455 314.943787 329.219238 315.353516 327 319 C 326.116333 320.451904 326.993774 322.621155 326 324 C 324.428589 326.180176 320.76416 325.972656 319 328 C 316.643311 330.708313 316.022949 334.558716 315 338 C 314.515625 339.629211 313.988403 341.300354 314 343 C 314.032715 347.772491 315.567749 352.447388 317 357 C 319.062256 363.555084 323.360962 369.326477 325 376 C 326.914673 383.796051 327.734009 392.00589 327 400 C 326.652466 403.784668 324.006226 407.199432 324 411 C 323.985352 419.97525 330.085083 428.071472 331 437 C 332.157349 448.293793 329.648193 459.665588 329 471 C 328.65686 476.999451 327.292725 483.032532 328 489 C 328.409668 492.455902 331 499 331 499 C 331 499 300.212769 509.825623 272 511 C 248.371704 511.983551 229.978882 509.822235 213 507 C 197.660889 504.450317 172.787048 498.253723 154 490 C 129.096191 479.05899 111 466 111 466 Z"
            strokeWidth={2}
            strokeDasharray="0 1"
            initial={{ pathLength: 0, fill: 'rgba(0,0,0,0)' }}
            animate={controlsDog}
          />
        </motion.g>
        <motion.path
          id="Ellipse"
          // fill="#8bf98e"
          fillRule="evenodd"
          stroke="none"
          d="M 511 255.5 C 511 114.391235 396.608765 0 255.5 0 C 114.391243 0 0 114.391235 0 255.5 C 0 396.608765 114.391243 511 255.5 511 C 396.608765 511 511 396.608765 511 255.5 Z"
          initial={{ scale: 0, opacity: 0, fill: 'rgba(0,0,0,0)' }}
          animate={controlsPulse}
        />
      </motion.svg>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            duration: pulseDuration,
            ease: 'easeInOut',
            repeat: 0,
            delay: 3.8 * SPEED_FACTOR,
          },
        }}></motion.div>
    </div>
  );
};

LoaderSVG.displayName = 'LoaderSVG';

export default LoaderSVG;
