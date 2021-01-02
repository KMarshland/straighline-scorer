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
                        Area-weighted deviation.
                        This finds the area between the line you went and your target line, then divides it by your target line distance.
                        The closer to zero this is the better.
                    </li>

                    <li>
                        Line vs track distance.
                        This takes line distance as a percentage of total distance of your GPS track.
                        If you followed the line perfectly, this will be 100%.
                        If you made lots of zig-zags, this will be close to 0%.
                        A big caveat here is that if you didn't complete the line, this value is meaningless.
                    </li>
                </ul>

                Additionally, it applies a smoothing algorithm and calculates these same metrics a second time. This
                smoothing algorithm can be useful for getting rid of GPS jitter, but it also risks your scores looking
                better than they are in reality.

                <h3>Technical notes</h3>
                <ul>
                    <li>
                        This uses the WGS84 model of the earth in all places. The WGS84 model models the earth as an
                        oblate spheroid, rather than as a perfect sphere, and is the industry-standard.
                    </li>

                    <li>
                        For calculating distances between points, it uses
                        the <a href="http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf" target="_blank" rel="noopener noreferrer">Vincenty inverse formula</a>, which has
                        a resolution of approximately 0.5mm. However, for efficiency reasons, when calculating
                        deviations from the line, it only finds the closest point on the line to the nearest centimeter.
                    </li>

                    <li>
                        The smoothing algorithm used is a Gaussian filter with sigma=1.
                        For the convolution, it uses reflection of the signal at the edges.
                        That said, I'm not super happy with this filtering algorithm.
                        It might be worth trying an angle-based filter.
                    </li>

                    <li>
                        To calculate area, a series of polygons are described by taking, for each GPS track point, the
                        point, the closest point on the line, the previous GPS track point, and the closest point on the
                        line to that point. The areas of these are calculated via Gauss-Legendre 10th order quadratures
                        and the areas are summed.
                    </li>
                </ul>
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

