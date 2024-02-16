import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { NavLink, useLocation } from 'react-router-dom';
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
import { t } from 'i18next';

const Payment = () => {
    const [userData, setUserData] = useState<any>([]);
    const { t } = useTranslation();
    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get(`${config.API_BASE_URL}/subscriptionMaster/getAllSubscriptions`);
            console.log(data);

            setUserData(data.data);
            console.log(userData);
        };
        fetch();
    }, []);
    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const [value, setValue] = useState<any>('list');

    const [search, setSearch] = useState<any>('');
    // static for now

    const [filteredItems, setFilteredItems] = useState<any>(userData);
    const [isViewClicked, setViewClicked] = useState(false);
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [company_id, setCompany_id] = useState<any>()

    console.log(filteredItems, 'filteredItems', userData);

    useEffect(() => {
        setFilteredItems(() => {
            return userData.filter((item: any) => {
                return item.Company.businessName.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, userData]);
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

    const editHandler = (id: any) => {
        setCompany_id(id);
        setAddContactModal(true);
        console.log('edit', id);
        const admin = userData.find((ele: any) => ele.subscriptionmaster_id === id);
        console.log(admin);
        formik.setValues(admin);
    };
    const deleteHandler = async (id: any) => {
        try {
            const response = await axios.delete(`${config.API_BASE_URL}/companies/${id}`);
            console.log(response);
            if (response.status === 200 || response.status === 201) {
                showMessage('admin has been deleted successfully.');

                // setUserData(userData.filter((item: any) => item.id !== id))
            }
        } catch (error) {
            // Handle error
            console.log('Error deleting admin:', error);
            showMessage('An error occurred while deleting the admin.');
        }
    };

    const formik = useFormik({
        initialValues: {},
        onSubmit: async (values: any, { resetForm }) => {
            try {
              

                let update = await axios.put(`${config.API_BASE_URL}/subscriptionMaster/update/${company_id}`, values);

                if (update.status === 201 || update.status === 200) {
                    showMessage('payment has been updated successfully.');
                    setAddContactModal(false);
                    resetForm();
                }
            } catch (error: any) {
                showMessage(`${error.response.data.message}`);
                console.error('Error submitting form:');
            }
        },
    });

    const viewHandler = (id: any) => {
        const admin = userData.find((ele: any) => ele.subscription_id === id);
        formik.setValues(admin);

        console.log(formik.values , "formik values");
        setViewClicked(true);
        setAddContactModal(true);
    }

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Admin</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <ul>
                                <li>
                                    <NavLink className="btn btn-primary" to="/location/route">
                                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add New Payment
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Contacts" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {value === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>date</th>
                                    <th>Company Name</th>
                                    <th>planName</th>
                                    <th>planType</th>
                                    <th>amount</th>
                                    <th>Payment Mode</th>
                                    <th>transaction date</th>
                                    <th>reference Id</th>
                                    <th>PaymentStatus</th>
                                    <th>status</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((userData: any) => {
                                    return (
                                        <tr key={userData.id}>
                                            <td className="whitespace-nowrap">{userData.subscriptionmaster_id}</td>
                                            <td className="whitespace-nowrap">{userData.PaymentDate ? userData.PaymentDate.slice(0, 10) : ""}</td>
                                            <td className="whitespace-nowrap">{userData?.Company?.businessName}</td>
                                            <td className="whitespace-nowrap">{userData.Subscription.planName}</td>
                                            <td className="whitespace-nowrap">{userData.Subscription.planType}</td>
                                            <td className="whitespace-nowrap">{userData.Subscription.amount}</td>
                                            <td className="whitespace-nowrap">{userData.paymentMode}</td>
                                            <td className="whitespace-nowrap">{userData.transactionDate ? userData.transactionDate.slice(0, 10) : ""}</td>
                                            <td className="whitespace-nowrap">{userData.paymentReference}</td>
                                            <td className="whitespace-nowrap">{userData.PaymentStatus}</td>
                                            <td className="whitespace-nowrap">{userData.status}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary">
                                                        Print
                                                    </button>
                                                    {userData.PaymentStatus != 'Paid' && (<button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editHandler(userData.subscriptionmaster_id)}>
                                                        Edit
                                                    </button>)}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
{/*  update model */}

<Transition appear show={addContactModal} as={Fragment}>
                <Dialog
                    as="div"
                    open={addContactModal}
                    onClose={() => {
                        setAddContactModal(false);
                        setViewClicked(false);
                    }}
                    className="relative z-[51]"
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <div className="p-5">
                                        {/* Form */}
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
                                    className="form-input"
                                    // readOnly
                                />
                            </div>
                            <div>
                                <label htmlFor="PaymentDate"> Company </label>
                                <input id="" name="businessName" onChange={formik.handleChange} value={formik.values?.Company?.businessName} type="text" className="form-input" readOnly />

                            </div>
                        </div>
                        <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-3 gap-4 mr-5">
                            <div>
                            <label htmlFor="PaymentDate"> Plan </label>
                            <input id="businessName" name="amount" onChange={formik.handleChange} value={formik.values?.Subscription?.planName} type="text" className="form-input" readOnly />
                                
                            </div>
                            <div>
                                <label htmlFor="businessName">Amount</label>
                                <input id="businessName" name="amount" onChange={formik.handleChange} value={formik?.values?.Subscription?.amount} type="text" className="form-input" readOnly />
                            </div>
                            <div>
                                <label htmlFor="businessName">Collect Amount</label>
                                <input id="businessName" name="amount" onChange={formik.handleChange} value={formik.values.Subscription?.amount} type="input" className="form-input" />
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
                                        {/* close form */}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </div>
    );
};

export default Payment;
