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

const Subscription = () => {
    const [userData, setUserData] = useState<any>([]);
    const { t } = useTranslation();
    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get(`${config.API_BASE_URL}/subscription/getsubscriptions`);
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
                return item.planName.toLowerCase().includes(search.toLowerCase());
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
        const admin = userData.find((ele: any) => ele.subscription_id === id);
        console.log(admin);
        formik.setValues(admin);
    };
    const deleteHandler = async (id: any) => {
        try {
            const response = await axios.delete(`${config.API_BASE_URL}/subscription/deletesubscriptionsById/${id}`);
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
              

                let update = await axios.put(`${config.API_BASE_URL}/subscription/updatesubscriptionsById/${company_id}`, values);

                if (update.status === 201 || update.status === 200) {
                    showMessage('plan has been updated successfully.');
                    setAddContactModal(false);
                    resetForm();
                }
            } catch (error) {
                for (const key in { ...formik.values }) {
                    !formik.values[key] ? showMessage(` ${key}`) : '';
                }
                console.error('Error submitting form:', error);
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
                                    <NavLink className="btn btn-primary" to="/location/state">
                                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add New Plan
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
                                    <th>Plan Name </th>
                                    <th>PlanType</th>
                                    <th>In Numbers</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((userData: any , i : any) => {
                                    return (
                                        <tr key={userData.id}>
                                            <td className="whitespace-nowrap text-center">{i + 1}</td>
                                            <td className="whitespace-nowrap text-center">{userData.planName}</td>
                                            <td className="whitespace-nowrap text-center">{userData.planType}</td>
                                            <td className="whitespace-nowrap text-center">{userData.months_Year_Num}</td>
                                            <td className="whitespace-nowrap text-center">{userData.amount}</td>
                                            <td className="whitespace-nowrap text-center">{userData.status}</td>

                                            <td>
                                                {!userData.activeUsers && (
                                                    <div className="flex gap-2 items-center justify-center">
                                                    
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editHandler(userData.subscription_id)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={()=>deleteHandler(userData.subscription_id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                                )}
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

export default Subscription;
