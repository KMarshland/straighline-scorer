import style from './about.scss';

export default function About(){
    return (
        <div class={style.about}>
            <p>
                <h2>What is a straighline mission?</h2>

                Pioneered by <a href="https://www.youtube.com/c/GeoWizard" target="_blank" rel="noopener noreferrer">Tom Davies aka GeoWizard</a>,
                straightline missions are attempt to cross a region in as straight a line as possible.
                When you get to a mountain, you climb it.
                When you get to a river, you swim through it.
                You must go as straight as possible.
                For top-notch examples of this, check out GeoWizard's missions:

                <ul>
                    <li>
                        <a href="https://www.youtube.com/playlist?list=PL_japiE6QKWoP-qPQ3wXuOtLkZeYumJRH" target="_blank" rel="noopener noreferrer">
                            Mission across Norway
                        </a>
                    </li>

                    <li>
                        <a href="https://www.youtube.com/playlist?list=PL_japiE6QKWphPxjqn0KJjfoRnuVSELaI" target="_blank" rel="noopener noreferrer">
                            Mission across Wales, Attempt 1
                        </a>
                    </li>

                    <li>
                        <a href="https://www.youtube.com/playlist?list=PL_japiE6QKWo358zmUkEydTjyLzd1yBh5" target="_blank" rel="noopener noreferrer">
                            Mission across Wales, Attempt 2
                        </a>
                    </li>
                </ul>
            </p>

            <p>
                <h2>This is a tool for figuring out just how straight you went on a mission</h2>
                It takes in a .gpx or a .kml file, shows it on a globe, and generates a variety of metrics on how straight it was:
                <ul>
                    <li>
                        Max deviation.
                        This is pretty self-explanatory: how far from your target line did you ever stray?
                        The lower this number is, the better
                    </li>

                    <li>
                        Line distance divided by total distance.
                        The closer this is to one, the better: if you wander lots, your distance traveled will be longer, whereas the line distance won't have changed.
                    </li>

                    <li>
                        Line distance divided by total distance, with smoothing.
                        This is just like the previous metric, except it applies a smoothing algorithm to get rid of GPS jitter.
                    </li>

                    <li>
                        Total area divided by line distance.
                        This finds the area between the line you went and your target line (using Euler's method with a 1m resolution), then divides it by your target line distance.
                        The closer to zero this is the better.
                    </li>

                    <li>
                        Total area divided by line distance, with smoothing.
                        This is just like the previous metric, except it applies a smoothing algorithm to get rid of GPS jitter.
                    </li>
                </ul>

                The smoothing algorithm used is a Gaussian filter with sigma=1, using reflection of the signal in the convolution at the edges.
            </p>

            <p>
                <h2>This tool was written by Kai Marshland</h2>
                The code is open-source and MIT-licensed; view it at <a href="https://github.com/KMarshland/straightline-scorer" target="_blank" rel="noopener noreferrer">
                    https://github.com/KMarshland/straightline-scorer
                </a>. Pull requests welcome!
            </p>

            <p>
                <h2>Have feedback?</h2>
                You can submit it <a href="https://forms.gle/QKs42g4RtNh8SYKu5" target="_blank" rel="noopener noreferrer">here</a>.
            </p>
        </div>
    );
}

