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
import City from './City';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MultiSelect } from '@mantine/core';

const Route = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        country_name: '',
    });
    const [payment, setPayment] = useState<any>([]);
    const [subscriptionData, setSubscriptionData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);
    const [adminPlan, setAdminPlan] = useState<any>();

    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    const [currentDate, setCurrentDate] = useState(getFormattedDate());

    // Helper function to get the current date in "YYYY-MM-DD" format

    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get(`${config.API_BASE_URL}/subscriptionMaster/getAllSubscriptions`);
            setPayment(data.data);
            console.log(data, '666666666666666666666666666666666');

            console.log('payment', payment);
            const subscriptionPlan = await axios.get(`${config.API_BASE_URL}/subscription/getsubscriptions`);
            console.log('subscriptionPlan', subscriptionPlan);
            setSubscriptionData(subscriptionPlan.data.data);
            console.log(subscriptionData, 'subscriptionData');
        };
        fetch();
    }, [addContactModal]);
    useEffect(() => {}, [payment]);

    // static for now
    let [contactList] = useState<any>(payment);

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
        paymentMode: Yup.string().required('Payment Mode is required'),
    });

    const initialValues = {
        subscriptionmaster_id: '',
        amount: 0,
        PaymentStatus: 'paid',
        PaymentDate: '',
        paymentReference: '',
        paymentMode: '',
        transactionDate: '',
    };
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async (values: any, { resetForm }) => {
            try {
                console.log(values);
                values.amount = adminPlan.Subscription.amount;
                !formik.values.PaymentDate ? (formik.values.PaymentDate = new Date()) : '';
                let SubscriptionPlanMaster = await axios.put(`${config.API_BASE_URL}/subscriptionMaster/update`, values);
                console.log(SubscriptionPlanMaster);

                if (SubscriptionPlanMaster.status === 200 || SubscriptionPlanMaster.status === 201) {
                    showMessage('payment added successfully.');
                    // window.location.reload()
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

    function getFormattedDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl ml-10"> Add Payment Details</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto "></div>
            </div>
            <div className="">
                <form onSubmit={formik.handleSubmit} className="shadow-lg shadow-indigo-500/40 p-4 ">
                    <div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-2 gap-4 mr-5">
                            <div>
                                <label htmlFor="businessName">Payment Date </label>
                                <input
                                    id="PaymentDate"
                                    name="PaymentDate"
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.values.PaymentDate = !e.target.value ? new Date() : e.target.value;
                                    }}
                                    type="date"
                                    placeholder={currentDate}
                                    className="form-input"
                                    // readOnly
                                />
                            </div>
                            <div>
                                <label htmlFor="PaymentDate">Select Company </label>
                                <select
                                    name="subscriptionmaster_id"
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.values.subscriptionmaster_id = e.target.value;
                                        const findCurrnentPlan = payment.find((item: any) => item.subscriptionmaster_id == e.target.value);

                                        setAdminPlan(findCurrnentPlan);
                                    }}
                                    id="1"
                                    className="form-select text-white-dark"
                                    value={formik.values.subscriptionmaster_id}
                                    required
                                >
                                    <option value="">Select company </option>
                                    {payment && payment.length > 0
                                        ? payment.map((item: any) => {
                                              return (
                                                  <option key={item.id} value={item.subscriptionmaster_id}>
                                                      {item.Company.businessName}
                                                  </option>
                                              );
                                          })
                                        : 'No data found'}
                                </select>
                            </div>
                        </div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-3 gap-4 mr-5">
                            <div>
                                <label htmlFor="businessName">Select Plan</label>
                                <select name="subscription_id" onChange={formik.handleChange} id="1" className="form-select text-white-dark" value={formik.values.subscription_id}>
                                    <option value="">{adminPlan?.Subscription?.planName}</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="businessName">Amount</label>
                                <input id="businessName" name="amount" onChange={formik.handleChange} value={adminPlan?.Subscription?.amount} type="text" className="form-input" readOnly />
                            </div>
                            <div>
                                <label htmlFor="businessName">Collect Amount</label>
                                <input id="businessName" name="businessType" onChange={formik.handleChange} value={adminPlan?.Subscription?.amount} type="input" className="form-input" />
                            </div>
                        </div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-2 gap-4 mr-5">
                            <div>
                                <label htmlFor="businessName">trasction Date </label>
                                <input
                                    id="businessName"
                                    name="transactionDate"
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.values.transactionDate = !e.target.value ? new Date() : e.target.value;
                                    }}
                                    // value={currentDate}
                                    type="date"
                                    defaultValue={new Date().toDateString()}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="businessName">Payment Mode</label>
                                <select name="paymentMode" onChange={formik.handleChange} id="1" className="form-select text-white-dark" value={formik.values.paymentMode} required>
                                    <option value="Online">Online</option>
                                    <option value="wire">wire</option>
                                    <option value="cash">cash</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="businessName">reference number </label>
                                <input
                                    id="paymentReference"
                                    name="paymentReference"
                                    onChange={formik.handleChange}
                                    value={formik.values.paymentReference}
                                    type="text"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid mt-4 mr-20 ml-10 mb-10 grid-cols-4 p-5 sm:grid-cols-4 gap-2 mr-5 mb-10">
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

export default Route;
