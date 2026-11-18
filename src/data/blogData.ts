import photometryImg from '../assets/images/archival/orbitx-plate-photometry.png';
import observatoryImg from '../assets/images/archival/orbitx-observatory-station.png';
import opticsBlueprintImg from '../assets/images/archival/orbitx-optics-blueprint.png';
import coronaImg from '../assets/images/archival/orbitx-plate-corona.png';
import saturnMonumentImg from '../assets/images/archival/orbitx-saturn-monument.png';
import type { BlogPost } from '../types/blog';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
    {
        id: 'blog-001',
        slug: 'photometric-deep-sky-study-pune',
        title: 'Photometric Analysis of Deep-Sky Variables at Pune Outskirts',
        subtitle: 'Field report and CCD photometric measurements conducted during the OrbitX observation campaign.',
        category: 'Astrophysics',
        author: {
            name: 'OrbitX Observational Team',
            role: 'Research & Astronomy Wing',
            team: 'Technical Team'
        },
        publishedAt: 'October 8, 2026',
        readTime: '6 min read',
        coverImage: photometryImg,
        featured: true,
        summary: 'A comprehensive study on aperture photometry calibrated against standard field stars, exploring light curve variations under rural Pune seeing conditions.',
        content: {
            intro: 'During our recent multi-night observation campaign at the rural outskirts of Narhe and Sinhagad foothills, the OrbitX observational team captured time-series photometric data on selected RR Lyrae and Cepheid variable stars. Under Bortle Class 4 skies, our goal was to measure differential flux changes and cross-correlate them with existing catalog epochs.',
            sections: [
                {
                    heading: 'Calibration & Image Pre-processing',
                    body: 'All exposures were gathered using an 8-inch Schmidt-Cassegrain reflector fitted with a Peltier-cooled monochrome CMOS sensor. Calibration frames—comprising bias frames, 20 dark frames at -10°C, and twilight sky flats—were captured each night. Calibration pipelines ensured dark current subtraction and optical vignetting correction before photometric extraction.',
                    highlight: 'Differential aperture photometry eliminated variable atmospheric transparency fluctuations by comparing target star flux with three proximate non-variable reference stars in the same CCD field.'
                },
                {
                    heading: 'Epoch Timing and Light Curve Extraction',
                    body: 'Aperture radii were dynamically selected based on nightly full-width at half-maximum (FWHM) seeing metrics, typically averaging 2.4 arcseconds. Signal-to-noise ratios exceeded 120 across all primary target phases, allowing us to accurately determine the time of maximum light with an uncertainty of less than 0.003 days.',
                    highlight: 'The extracted phase-folded light curves clearly showed the asymmetric pulsation profile characteristic of radial stellar oscillation.'
                },
                {
                    heading: 'Data Archiving and Next Phases',
                    body: 'The raw FITS files and calibrated differential magnitude measurements have been archived in the OrbitX astronomical repository. Further multi-band BVRI filtration runs are scheduled for the upcoming winter observation nights to evaluate temperature color indices over the pulsation cycle.'
                }
            ],
            conclusion: 'Student participation in real photometric collection bridges theoretical astrophysics with rigorous observational mechanics, demonstrating that actionable research data is achievable with university-level instrumentation.'
        },
        tags: ['Photometry', 'Stellar Evolution', 'CCD Imaging', 'Field Observation']
    },
    {
        id: 'blog-002',
        slug: 'calibrating-dobsonian-optics-campus-stargazing',
        title: 'Collimation and Optical Alignment for Student Telescopes',
        subtitle: 'Practical mechanics for achieving diffraction-limited performance from Newtonian reflectors.',
        category: 'Instrumentation',
        author: {
            name: 'Optical Engineering Desk',
            role: 'Hardware & Optics Lab',
            team: 'Design & Innovation Team'
        },
        publishedAt: 'September 28, 2026',
        readTime: '5 min read',
        coverImage: opticsBlueprintImg,
        featured: false,
        summary: 'Step-by-step guidance on primary mirror center-spotting, secondary tilt alignment, and laser collimator calibration for campus stargazing rigs.',
        content: {
            intro: 'Optical misalignment is the single most common cause of degraded contrast and astigmatism in student-built and campus-operated Newtonian telescopes. Maintaining optical axis collinearity guarantees that coma and spherical aberration are strictly controlled within design tolerances.',
            sections: [
                {
                    heading: 'Understanding the Three Axis Alignments',
                    body: 'Newtonian collimation is not a single adjustment; it comprises three distinct geometric alignments: centering the secondary mirror beneath the focuser drawtube, tilting the secondary so its optical reflection intersects the primary center marker, and adjusting the primary cell push-pull screws to return the reflected beam to the focal plane axis.',
                    highlight: 'A laser collimator is only as accurate as its own internal alignment. Before adjusting mirrors, rotate the laser 360 degrees inside the focuser to ensure the red emitter does not wobble on the primary mirror surface.'
                },
                {
                    heading: 'Thermal Equilibration & Boundary Layers',
                    body: 'Even a perfectly collimated telescope will produce blurry, boiling planetary disks if the primary mirror is warmer than the ambient outdoor air. We evaluated the thermal settling curve of our 200mm Pyrex mirror and recorded a 45-minute stabilization window before high-magnification planetary observation is viable.'
                }
            ],
            conclusion: 'Regular mechanical tune-ups and methodical collimation verify that every student looking through the eyepiece at ZCOER observes razor-sharp lunar rilles and planetary bands as optically intended.'
        },
        tags: ['Optics', 'Telescopes', 'Collimation', 'Instrumentation']
    },
    {
        id: 'blog-003',
        slug: 'solar-cycle-25-maximum-analysis',
        title: 'Coronal Loops and Sunspot Dynamics: Solar Maximum 2026',
        subtitle: 'Narrowband Hydrogen-Alpha observation of active region magnetic complexity from Pune.',
        category: 'Observation Logs',
        author: {
            name: 'Solar Observation Unit',
            role: 'Solar Astronomy Division',
            team: 'Technical Team'
        },
        publishedAt: 'September 15, 2026',
        readTime: '4 min read',
        coverImage: coronaImg,
        featured: false,
        summary: 'Monitoring chromosphere solar flare eruptions, active sunspot magnetic shear, and prominences during the peak phase of Solar Cycle 25.',
        content: {
            intro: 'With Solar Cycle 25 exhibiting intense magnetic activity through 2026, the OrbitX daytime observation division has maintained active narrowband solar monitoring from the ZCOER engineering building terrace. Using dedicated etalon sub-angstrom Hydrogen-Alpha filtration, students have documented rapid magnetic reconfiguration across several complex sunspot groups.',
            sections: [
                {
                    heading: 'Chromospheric Flares and Filament Eruptions',
                    body: 'Over a continuous 4-hour morning session, active region AR3814 generated multiple Class-M solar flares accompanied by high-velocity eruptive filaments extending over 120,000 kilometers beyond the solar limb. Real-time video frame grabbing enabled Doppler velocity estimations based on shift in emission wavelength.'
                },
                {
                    heading: 'Safety Protocols and Sensor Protection',
                    body: 'Solar observation demands strict optical safety hygiene. Full-aperture energy rejection filters (ERF) are mandatory to reject infrared and ultraviolet thermal energy prior to entering the optical tube assembly, safeguarding both student eyes and sensitive CMOS silicon.'
                }
            ],
            conclusion: 'Solar astronomy provides campus members with an accessible diurnal laboratory for observing plasma physics and magnetohydrodynamics in real-time.'
        },
        tags: ['Solar Science', 'Hydrogen-Alpha', 'Chromosphere', 'Observation']
    },
    {
        id: 'blog-004',
        slug: 'high-altitude-balloon-telemetry-architecture',
        title: 'Stratospheric Sensor Payload Architecture on a Student Budget',
        subtitle: 'Designing low-power telemetry, GPS tracking, and cosmic ray sensing circuits for student missions.',
        category: 'Aerospace Engineering',
        author: {
            name: 'Avionics & Embedded Group',
            role: 'Electronics Division',
            team: 'Technical Team'
        },
        publishedAt: 'August 30, 2026',
        readTime: '7 min read',
        coverImage: observatoryImg,
        featured: false,
        summary: 'Architectural overview of low-power microcontroller telemetry transmitters, environmental sensor arrays, and thermal insulation tested to -55°C.',
        content: {
            intro: 'Near-space exploration via high-altitude latex meteorological balloons presents an exceptional proving ground for student aerospace engineering. Reaching altitudes in excess of 30,000 meters exposes payloads to near-vacuum pressure and temperatures plunging below -55°C, demanding dependable thermal management and low-power telemetry transmission.',
            sections: [
                {
                    heading: 'Avionics and Telemetry Architecture',
                    body: 'Our prototype flight package leverages an ARM Cortex-M0 microcontroller paired with a 433MHz LoRa long-range transceiver module. Environmental monitoring includes barometric pressure, external temperature, 3-axis inertial acceleration, and a dual-Geiger cosmic radiation count detector. Telemetry packets are broadcast at 1-second intervals using custom binary compression.',
                    highlight: 'At -50°C, conventional lithium-ion batteries lose over 80% of their operational capacity within minutes. High-density expanded polystyrene insulation and resistive heating elements were engineered into the core payload.'
                },
                {
                    heading: 'Predictive Trajectory and Recovery Strategy',
                    body: 'Wind drift modeling utilizing GFS (Global Forecast System) atmospheric wind vector data allowed our recovery simulation team to predict landing coordinates within a 4-kilometer radius, essential for rapid payload recovery across the Deccan plateau terrain.'
                }
            ],
            conclusion: 'Developing stratospheric avionics grounds students in fault-tolerant systems design, telemetry encoding, and real-world aerospace constraints.'
        },
        tags: ['Avionics', 'LoRa', 'Stratosphere', 'Embedded Systems']
    },
    {
        id: 'blog-005',
        slug: 'astrophotography-stacking-plate-processing',
        title: 'Plate Stacking and Noise Reduction: A Practical Primer',
        subtitle: 'Computational workflows for transforming noisy campus sky exposures into clean planetary plates.',
        category: 'Guides & Tutorials',
        author: {
            name: 'OrbitX Editing Wing',
            role: 'Digital Processing Desk',
            team: 'Social Media & Editing Team'
        },
        publishedAt: 'August 14, 2026',
        readTime: '5 min read',
        coverImage: saturnMonumentImg,
        featured: false,
        summary: 'Algorithmic breakdown of Lucky Imaging, Poisson noise distribution, wavelet sharpening, and color balance calibrations for beginner astrophotographers.',
        content: {
            intro: 'Urban and suburban campus environments present significant skyglow challenge for night sky photography. However, modern computational imaging algorithms and open-source stacking software empower students to extract faint signal from light-polluted backgrounds with proper signal-to-noise ratio (SNR) management.',
            sections: [
                {
                    heading: 'The Mathematics of Frame Stacking',
                    body: 'Uncorrelated sensor noise follows a Poisson and Gaussian distribution. By co-registering and averaging N sub-exposures, the signal accumulates linearly while random noise grows only by the square root of N, yielding a theoretical SNR improvement proportional to the square root of the total exposure count.',
                    highlight: 'For planetary imaging, atmospheric turbulence causes rapid local distortions. The Lucky Imaging technique samples the top 10% highest-contrast frames from a high-framerate stream, discarding turbulent distortion.'
                },
                {
                    heading: 'Post-Processing Wavelets & Curve Neutralization',
                    body: 'Once aligned, multi-scale wavelet decomposition isolates planetary banding without amplifying high-frequency noise. Background neutralization subtracts suburban sodium-vapor sky glow, restoring natural chromatic fidelity to planetary atmospheres.'
                }
            ],
            conclusion: 'Computational post-processing is an essential competency in contemporary astronomical imaging, turning modest university instruments into potent observation platforms.'
        },
        tags: ['Astrophotography', 'Signal Processing', 'Tutorial', 'Planetary']
    }
];
