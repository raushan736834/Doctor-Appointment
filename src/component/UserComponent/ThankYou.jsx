import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ThankYou = () => {
    const location = useLocation();
    const { date, time, doctorName, appointmentLocation } = location?.state || {};
    console.log(location.state);
    const fomateDate =(date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;

    }

    return (
        <div className="text-center p-12 font-sans">
            <h1 className="text-4xl text-green-500">Thank You!</h1>
            <p className="text-2xl text-gray-800">Your appointment has been successfully booked.</p>
            <p className="text-lg text-gray-500">We look forward to seeing you soon.</p>
            <div className="mt-8">
                {/* <p className="text-lg text-gray-700"><strong>Date:</strong> {date.toLocaleString()}</p> */}
                <p className="text-lg text-gray-700"><strong>Date:</strong> {fomateDate(date)}</p>
                <p className="text-lg text-gray-700"><strong>Time:</strong> {time}</p>
                <p className="text-lg text-gray-700"><strong>Doctor:</strong> {doctorName}</p>
                <p className="text-lg text-gray-700"><strong>Clinic Name:</strong> {appointmentLocation}</p>
            </div>
            <div className="mt-12 text-lg text-gray-700">
                <p>Best Regards,</p>
                <p><strong>{appointmentLocation}</strong></p>
            </div>
            <div>
                <Link to={"/"} ><button className="mt-8 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Back to Home</button></Link>
            </div>
        </div>
    );
};

export default ThankYou;
