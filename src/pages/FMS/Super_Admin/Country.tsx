import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUserPlus from '../../../components/Icon/IconUserPlus';
import IconListCheck from '../../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../../components/Icon/IconLayoutGrid';
import IconSearch from '../../../components/Icon/IconSearch';
import IconUser from '../../../components/Icon/IconUser';
import IconFacebook from '../../../components/Icon/IconFacebook';
import IconInstagram from '../../../components/Icon/IconInstagram';
import IconLinkedin from '../../../components/Icon/IconLinkedin';
import IconTwitter from '../../../components/Icon/IconTwitter';
import IconX from '../../../components/Icon/IconX';
import axios from 'axios';
import config from '../../../congif/config';
import { ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';

const Country = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        country_name: '',
    });
    const [userData, setUserData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    useEffect(() => {
        // const fetch = async () => {
        //     // const { data } = await axios.get(`${config.API_BASE_URL}/location/countries`);
        //     console.log('1111111111111111', data);
        //     setUserData(data);
        //     console.log(userData);
        // };
        // fetch();
    }, [addContactModal]);
    useEffect(() => {}, [userData]);

    // static for now
    let [contactList] = useState<any>(userData);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };
    const validationSchema = Yup.object().shape({
        country_name: Yup.string().required('Country Name is required'),
        password: Yup.string().required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Password confirmation is required'),
    });

    const initialValues = {
        businessLogo: '',
        businessType: '',
        businessName: '',
        contactPersonFullName: '',
        whatsappContact: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        countryName: '',
        address1: '',
        city1: '',
        state1: '',
        pincode1: '',
        countryName1: '',
        taxRegNo: '',
        websiteAddress: '',
        username: '',
        password: '',
        confirmPassword : "",
        adminId: 1,
    };
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async (values: any, { resetForm }) => {
            try {
                if (values.password !== values.confirmPassword) {
                    return showMessage('Passwords do not match', 'error');
                }
                const formData: any = new FormData();
                console.log(values, 'dfs');

                Object.keys(values).forEach((ele) => {
                    formData.append(ele, values[ele]);
                });
                delete formData.confirmPassword
                console.log('dddd', formData);

                let addUSer = await axios.post(`${config.API_BASE_URL}/companies`, formData);
                console.log(addUSer, 'ddddddddddddddddddd');

                if (addUSer.status === 201) {
                    formData.confirmPassword = values.confirmPassword
                    showMessage('User has been saved successfully.');
                    resetForm();
                }
            } catch (error: any) {
                for (const key in error.response.data.message) {
                    if (Object.prototype.hasOwnProperty.call(error.response.data.message, key)) {
                        const element = error.response.data.message[key];
                        showMessage(element);
                    }
                }
                console.error('Error submitting form:', error);
            }
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl ml-10"> Super Admin</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto "></div>
            </div>
            <div className="">
                <form onSubmit={formik.handleSubmit} className="shadow-lg shadow-indigo-500/40 p-4 ">
                    <div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-3 gap-4 mr-5">
                            <div>
                                <label htmlFor="businessName">Business Name</label>
                                <input
                                    id="businessName"
                                    name="businessName"
                                    onChange={formik.handleChange}
                                    value={formik.values.businessName}
                                    type="text"
                                    placeholder="Enter business Name"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="businessName">BusinessType</label>
                                <input
                                    id="businessName"
                                    name="businessType"
                                    onChange={formik.handleChange}
                                    value={formik.values.businessType}
                                    type="text"
                                    placeholder="Enter business Type "
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="businessLogo"> Business Logo </label>
                                <input
                                    id="businessLogo"
                                    className=" text-primary form-input"
                                    name="businessLogo"
                                    type="file"
                                    onChange={(event: any) => formik.setFieldValue('businessLogo', event.currentTarget.files[0])}
                                />
                            </div>
                        </div>
                        <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-1 gap-4 mr-5">
                            <div>
                                <label htmlFor="contactPersonFullName">Contact Person Full Name</label>
                                <input
                                    id="contactPersonFullName"
                                    name="contactPersonFullName"
                                    onChange={formik.handleChange}
                                    value={formik.values.contactPersonFullName}
                                    type="text"
                                    placeholder="Enter Contact Person FullName "
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-1 gap-4 mr-5">
                            <div>
                                <label htmlFor="websiteAddress" className="ml-2">
                                    Website Address
                                </label>
                                <input
                                    id="websiteAddress"
                                    name="websiteAddress"
                                    onChange={formik.handleChange}
                                    value={formik.values.websiteAddress}
                                    type="text"
                                    placeholder="Enter website Address"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-3 gap-4 mr-5">
                            <div>
                                <label htmlFor="phone" className="ml-2">
                                    Contact Number
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    onChange={formik.handleChange}
                                    value={formik.values.phone}
                                    type="tel"
                                    placeholder="Enter Contact Number"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="whatsappContact" className="ml-2">
                                    Whatsapp Contact Number
                                </label>
                                <input
                                    id="whatsappContact"
                                    name="whatsappContact"
                                    onChange={formik.handleChange}
                                    value={formik.values.whatsappContact}
                                    type="text"
                                    placeholder="Enter Whatsapp Contact Number"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="ml-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    type="text"
                                    placeholder="Enter Email Address"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className=" mt-4 mr-5 ml-10 ">
                            <label htmlFor="address" className="mb-4 mt-5 flex flex-col items-center">
                                Address 1
                            </label>
                            <input id="address" name="address" onChange={formik.handleChange} value={formik.values.address} type="text" placeholder="Enter Address 1" className="form-input" required />
                        </div>
                        <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-4 gap-4 mr-5">
                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    Country Name 1
                                </label>
                                <input
                                    id="countryName"
                                    name="countryName"
                                    onChange={formik.handleChange}
                                    value={formik.values.countryName}
                                    type="tel"
                                    placeholder="Enter Country Name 1"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    State
                                </label>
                                <input id="state" name="state" onChange={formik.handleChange} value={formik.values.state} type="text" placeholder="Enter State Name" className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    City 1
                                </label>
                                <input id="city" name="city" onChange={formik.handleChange} value={formik.values.city} type="text" placeholder="Enter City Name 1" className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    Pincode Number
                                </label>
                                <input
                                    id="pincode"
                                    name="pincode"
                                    onChange={formik.handleChange}
                                    value={formik.values.pincode}
                                    type="text"
                                    placeholder="Enter PinCode 1"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className=" mt-4 mr-5 ml-10 ">
                            <div>
                                <label htmlFor="address" className="mb-4 mt-5 flex flex-col items-center">
                                    Address 2
                                </label>
                                <input
                                    id="address1"
                                    name="address1"
                                    onChange={formik.handleChange}
                                    value={formik.values.address1}
                                    type="text"
                                    placeholder="Enter Address 1"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-4 gap-4 mr-5">
                            <div>
                                <label htmlFor="countryName1" className="ml-2">
                                    Country Name 2
                                </label>
                                <input
                                    id="countryName1"
                                    name="countryName1"
                                    onChange={formik.handleChange}
                                    value={formik.values.countryName1}
                                    type="tel"
                                    placeholder="Enter Country Name 1"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    State 2
                                </label>
                                <input
                                    id="state1"
                                    name="state1"
                                    onChange={formik.handleChange}
                                    value={formik.values.state1}
                                    type="text"
                                    placeholder="Enter State Name 2"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    City 2
                                </label>
                                <input id="city1" name="city1" onChange={formik.handleChange} value={formik.values.city1} type="text" placeholder="Enter City Name 1" className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    Pincode Number 2
                                </label>
                                <input
                                    id="pincode1"
                                    name="pincode1"
                                    onChange={formik.handleChange}
                                    value={formik.values.pincode1}
                                    type="text"
                                    placeholder="Enter PinCode 2"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4 mr-5 ml-10 flex flex-col items-center">
                            <label htmlFor="routename" className="ml-2">
                                Tax Registration Number
                            </label>
                            <input
                                id="taxRegNo"
                                name="taxRegNo"
                                onChange={formik.handleChange}
                                value={formik.values.taxRegNo}
                                type="tel"
                                placeholder="Tax Registration Number"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-3 gap-4 mr-5">
                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    User Name
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    onChange={formik.handleChange}
                                    value={formik.values.username}
                                    type="text"
                                    placeholder="Enter User Name"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    type="text"
                                    placeholder="Enter Password"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="routename" className="ml-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="password"
                                    name="confirmPassword"
                                    onChange={formik.handleChange}
                                    value={formik.values.confirmPassword}
                                    type="text"
                                    placeholder="Reenter Password"
                                    className="form-input"
                                    required
                                />
                                </div>
                        </div>
                        <div className="grid mt-5 mr-20 ml-20 mb-5 grid-cols-4 p-5 sm:grid-cols-2 gap-2">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto w-100 mr-2 w-full ">
                                Submit
                            </button>
                            <button type="button" onClick={formik.handleReset} className="bg-red-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto w-full ">
                                Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Country;
