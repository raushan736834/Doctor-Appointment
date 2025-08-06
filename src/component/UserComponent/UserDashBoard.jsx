import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, Search, Bell, Settings, FileText, Phone, Mail, MapPin, Filter, X, Star, ChevronRight, Heart, Shield, Award } from 'lucide-react';

const UserDashBoard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const [userAppointments, setUserAppointments] = useState([
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      date: '2025-07-30',
      time: '10:00',
      status: 'confirmed',
      hospital: 'City Medical Center',
      address: '123 Healthcare Ave, Medical District'
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      date: '2025-08-02',
      time: '14:30',
      status: 'pending',
      hospital: 'Heart Care Clinic',
      address: '456 Wellness Blvd, Downtown'
    }
  ]);

  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      rating: 4.8,
      reviews: 124,
      experience: '15 years',
      hospital: 'City Medical Center',
      image: '👩‍⚕',
      fee: '$80',
      availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.9,
      reviews: 89,
      experience: '12 years',
      hospital: 'Heart Care Clinic',
      image: '👨‍⚕',
      fee: '$120',
      availableSlots: ['10:30', '11:30', '14:30', '15:30', '16:30']
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Dermatology',
      rating: 4.7,
      reviews: 156,
      experience: '10 years',
      hospital: 'Skin Health Institute',
      image: '👩‍⚕',
      fee: '$100',
      availableSlots: ['09:30', '10:30', '13:00', '14:00', '15:00']
    },
    {
      id: 4,
      name: 'Dr. Robert Wilson',
      specialty: 'Orthopedics',
      rating: 4.6,
      reviews: 98,
      experience: '18 years',
      hospital: 'Joint Care Center',
      image: '👨‍⚕',
      fee: '$110',
      availableSlots: ['08:00', '09:00', '11:00', '13:30', '14:30']
    }
  ]);

  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    phone: '',
    email: '',
    symptoms: '',
    notes: ''
  });

  const specialties = [
    { name: 'General Medicine', icon: '🩺', color: 'bg-blue-100 text-blue-600' },
    { name: 'Cardiology', icon: '❤', color: 'bg-red-100 text-red-600' },
    { name: 'Dermatology', icon: '🔬', color: 'bg-green-100 text-green-600' },
    { name: 'Orthopedics', icon: '🦴', color: 'bg-orange-100 text-orange-600' },
    { name: 'Pediatrics', icon: '🧸', color: 'bg-purple-100 text-purple-600' },
    { name: 'Dentistry', icon: '🦷', color: 'bg-indigo-100 text-indigo-600' }
  ];

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    
    const newAppointment = {
      id: userAppointments.length + 1,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      hospital: selectedDoctor.hospital,
      address: selectedDoctor.hospital + ' Address',
      ...bookingForm
    };
    
    setUserAppointments([...userAppointments, newAppointment]);
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingForm({ patientName: '', phone: '', email: '', symptoms: '', notes: '' });
    setActiveTab('appointments');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MediBook
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <span className="text-sm font-medium text-gray-700">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'home', label: 'Home', icon: Heart },
            { id: 'doctors', label: 'Find Doctors', icon: User },
            { id: 'appointments', label: 'My Appointments', icon: Calendar }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">Book Your Medical Appointment</h2>
                <p className="text-blue-100 mb-6">
                  Connect with qualified doctors, schedule appointments, and manage your healthcare journey all in one place.
                </p>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center"
                >
                  Find a Doctor
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            {/* Specialties Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by Specialty</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {specialties.map(specialty => (
                  <button
                    key={specialty.name}
                    onClick={() => setActiveTab('doctors')}
                    className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-gray-100"
                  >
                    <div className="text-3xl mb-3">{specialty.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{specialty.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure & Private</h4>
                <p className="text-gray-600 text-sm">Your medical information is protected with industry-standard security.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Qualified Doctors</h4>
                <p className="text-gray-600 text-sm">All our doctors are verified and highly qualified professionals.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Easy Scheduling</h4>
                <p className="text-gray-600 text-sm">Book appointments 24/7 with real-time availability.</p>
              </div>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search doctors, specialties, hospitals..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {doctors.map(doctor => (
                <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl">
                        {doctor.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                        <p className="text-gray-600 text-sm mb-2">{doctor.hospital}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            {doctor.rating} ({doctor.reviews} reviews)
                          </div>
                          <span>•</span>
                          <span>{doctor.experience} experience</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-2">{doctor.fee}</div>
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowBookingModal(true);
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h2>
              <div className="space-y-4">
                {userAppointments.map(appointment => (
                  <div key={appointment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold">
                          {appointment.doctorName.split(' ')[1][0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                          <p className="text-blue-600 text-sm">{appointment.specialty}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(appointment.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {appointment.hospital}
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
                {userAppointments.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments scheduled yet</p>
                    <button
                      onClick={() => setActiveTab('doctors')}
                      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Book Your First Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Doctor Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl">
                    {selectedDoctor.image}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedDoctor.name}</h3>
                    <p className="text-blue-600">{selectedDoctor.specialty}</p>
                    <p className="text-gray-600 text-sm">{selectedDoctor.hospital}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{selectedDoctor.fee}</p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDoctor.availableSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={bookingForm.patientName}
                    onChange={(e) => setBookingForm({...bookingForm, patientName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms/Reason for Visit</label>
                  <textarea
                    value={bookingForm.symptoms}
                    onChange={(e) => setBookingForm({...bookingForm, symptoms: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Briefly describe your symptoms or reason for visit"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTime || !bookingForm.patientName}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashBoard;
              