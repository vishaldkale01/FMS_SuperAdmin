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
import { useFormik } from 'formik';
import * as Yup from 'yup';

const State = () => {
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
    });

    const initialValues = {
        planType: '',
        months_Year_Num: '',
        amount: '',
        planName: '',
    };
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async (values: any, { resetForm }) => {
            try {
                const formData: any = new FormData();

                let SubscriptionPlan = await axios.post(`${config.API_BASE_URL}/subscription/add`, values);
                console.log(SubscriptionPlan, 'ddddddddddddddddddd');

                if (SubscriptionPlan.status === 201) {
                    showMessage('Subscription plan has been created successfully.');
                    resetForm();
                }
            } catch (error) {
                for (const key in { ...formik.values }) {
                    !formik.values[key] ? showMessage(`required ${key}`) : '';
                }
                console.error('Error submitting form:', error);
            }
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl ml-10"> Subscription</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto "></div>
            </div>
            <div className="">
                <form onSubmit={formik.handleSubmit} className="shadow-lg shadow-indigo-500/40 p-4 ">
                    <div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-2 sm:grid-cols-2 gap-4 mr-5">
                            <div>
                                <label htmlFor="planName">Plan Name</label>
                                <input
                                    id="planName"
                                    name="planName"
                                    onChange={formik.handleChange}
                                    value={formik.values.planName}
                                    type="text"
                                    placeholder="Enter Plan Name"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="planName">Plan Type</label>
                                <select name="planType" onChange={formik.handleChange} id="1" className="form-select text-white-dark" value={formik.values.planType} required>
                                <option >Select plan type</option>
                               <option value="Yearly">Yearly</option>
                               <option value="Monthly">Monthly</option>
                               </select>
                            </div>
                            
                        </div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-2 gap-4 mr-5">
                        <div>
                                <label htmlFor="months_Year_Num"> select in number </label>
                                <select name="months_Year_Num" onChange={formik.handleChange} id="1" className="form-select text-white-dark" value={formik.values.months_Year_Num} required>
                                    <option >Select at list one</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                    <option value={8}>8</option>
                                    <option value={9}>9</option>
                                    <option value={10}>10</option>
                                    <option value={11}>11</option>
                                    {formik.values.planType === "Yearly" ? <option value={12}>12</option>  : "" } 
                                    
                                </select>
                                
                            </div>

                            <div>
                                <label htmlFor="amount">Amount</label>
                                <input
                                    id="amount"
                                    name="amount"
                                    onChange={formik.handleChange}
                                    value={formik.values.amount}
                                    type="text"
                                    placeholder="Enter amount"
                                    className="form-input"
                                    required
                                />
                            </div>

                        </div>
                        <div className="grid mt-4 mr-20 ml-10 mb-10 grid-cols-4 p-5 sm:grid-cols-4 gap-2 mr-5 mb-10">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto w-100 mr-2 w-full ">
                                Create
                            </button>
                            <button type="submit" className="bg-red-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto w-full ">
                                Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default State;
