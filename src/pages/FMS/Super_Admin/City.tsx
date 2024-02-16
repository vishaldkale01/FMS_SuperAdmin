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

const City = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        country_name: '',
    });
    const [companyData, setCompanyData] = useState<any>([]);
    const [subscriptionData, setSubscriptionData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);
    const [currentDate, setCurrentDate] = useState<any>();

    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get(`${config.API_BASE_URL}/companies`);
            
            setCompanyData(data.data);
            console.log("lets check" ,data.data ,"Dattt" , data.data.filter((item : any)  => !item.subscriptionId));
            console.log('companies', companyData);
            const subscriptionPlan = await axios.get(`${config.API_BASE_URL}/subscription/getsubscriptions`)
            console.log('subscriptionPlan', subscriptionPlan);
            setSubscriptionData(subscriptionPlan.data.data)
            console.log(subscriptionData, 'subscriptionData');
            
        };
        fetch();
    }, [addContactModal]);
    useEffect(() => {}, [companyData]);

    // static for now
    let [contactList] = useState<any>(companyData);

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
        company_id : "" ,
        subscription_id : "" ,
        startDate : new Date() ,
        endDate : "" ,
        amount : 0 ,
        // PaymentStatus : "" ,
        // PaymentDate : "" ,
        // paymentReference : "" ,
        // paymentMode : "" ,
        // transactionDate : "" ,
    };
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async (values: any, { resetForm }) => {
            try {
                console.log(values);
                
                let SubscriptionPlanMaster = await axios.post(`${config.API_BASE_URL}/subscriptionMaster`, values);

                if (SubscriptionPlanMaster.status === 201) {
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

    const  calculateEndDate = (newDate : any) => {
        const start = new Date(newDate);
        console.log(formik.values.subscription_id, "1111111111111111111111111111");
        
        const subscriptionlan = subscriptionData.find((item: any) => item.subscription_id === parseInt(formik.values.subscription_id))
        console.log(subscriptionlan , ".......");
        
        if (subscriptionlan.planType === 'Monthly') {
          start.setMonth(start.getMonth() + subscriptionlan.months_Year_Num)
        } else if (subscriptionlan.planType === 'Yearly') {
          start.setFullYear(start.getFullYear() + subscriptionlan.months_Year_Num);
        }
        console.log(newDate.toLocaleString());
        
        formik.values.endDate = new Date(start)
        const today = new Date(formik.values.endDate);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setCurrentDate(`${day}-${month}-${year}`);
        console.log(start.toLocaleString());
        return start.toLocaleString()
      }
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl ml-10"> Assign Subscription plan</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto "></div>
            </div>
            <div className="">
                <form onSubmit={formik.handleSubmit} className="shadow-lg shadow-indigo-500/40 p-4 ">
                    <div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-2 gap-4 mr-5">
                            <div>
                                <label htmlFor="businessName">Select Company </label>
                                <select name="company_id" onChange={formik.handleChange} id="1" className="form-select text-white-dark" value={formik.values.company_id} required>
                                
                                    <option value="">Select company </option>
                                    {companyData && companyData.length > 0 
                                    ? companyData.map((item: any) => {
                                        return (
                                            <option key={item.id} value={item.company_id}>
                                                {item.businessName}
                                            </option>
                                        );
                                    })
                                    : "No data found"}
                                    </select>

                            </div>
                            <div>
                                <label htmlFor="businessName">Contact Person Name </label>
                                <input
                                    id="businessName"
                                    name="businessType"
                                    onChange={formik.handleChange}
                                    value={companyData.find((item: any) => item.company_id == formik.values.company_id)?.contactPersonFullName}
                                    type="text"
                                    className="form-input"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-3 gap-4 mr-5">
                            <div>
                                <label htmlFor="businessName">Select Plan</label>
                                <select name="subscription_id" onChange={formik.handleChange} id="1" className="form-select text-white-dark" value={formik.values.subscription_id} required>
                                
                                    <option value="">Select Plan </option>
                                    {subscriptionData && subscriptionData.length > 0 
                                    ? subscriptionData.map((item: any) => {
                                        return (
                                            <option key={item.subscription_id} value={item.subscription_id}>
                                                {item.planName}
                                            </option>
                                        );
                                    })
                                    : "No data found"}
                                    </select>
                            </div>
                            <div>
                                <label htmlFor="businessName">Amount</label>
                                <input
                                    id="businessName"
                                    name="amount"
                                    onChange={(e)=>{
                                        formik.handleChange
                                       const amount =  subscriptionData.find((item: any) => item.subscription_id == formik.values.subscription_id)
                                       console.log(amount , "...................................");
                                        
                                       formik.values.amount = amount.amount
                                    }}
                                    type="text"
                                    placeholder={subscriptionData.find((item: any) => item.subscription_id == formik.values.subscription_id)?.amount}
                                    className="form-input"
                                    readOnly
/>
                            </div>
                            <div>
                                <label htmlFor="businessName">Type</label>
                                <input
                                    id="businessName"
                                    name="businessType"
                                    onChange={formik.handleChange}
                                    value={subscriptionData.find((item: any) => item.subscription_id == formik.values.subscription_id)?.planType}
                                    type="text"
                                    className="form-input"
                                    readOnly
/>
                            </div>
                        </div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-2 gap-4 mr-5">
                            <div>
                                <label htmlFor="businessName">start Date</label>
                                <input
                                    id="businessName"
                                    name="startDate"
                                    onChange={(e)=>{
                                        formik.handleChange
                                        formik.values.startDate = e.target.value
                                        const Newdate = new Date(e.target.value)
                                        calculateEndDate(Newdate)
                                    }}
                                    value={formik.values.startDate}
                                    
                                    type="date"
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="businessName">End Date</label>
                                <input
                                    id="businessName"
                                    name="businessType"
                                    onChange={formik.handleChange}
                                    value={currentDate}
                                    type="text"
                                    readOnly
                                    placeholder=" "
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

export default City;
