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

const Border = () => {
    const [userData, setUserData] = useState<any>([]);
    const { t } = useTranslation();
    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get(`${config.API_BASE_URL}/companies`);
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
    console.log(filteredItems, 'filteredItems', userData);

    useEffect(() => {
        setFilteredItems(() => {
            return userData.filter((item: any) => {
                return item.businessName.toLowerCase().includes(search.toLowerCase());
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

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Admin</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <ul>
                                <li>
                                    <NavLink className="btn btn-primary" to="/location/country">
                                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add New Admin
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
                                    <th>Company Name</th>
                                    <th>Contact Person Full Name</th>
                                    <th>business Type </th>
                                    <th>phone </th>
                                    <th>whatsapp Contact Number </th>
                                    <th>Email id </th>
                                    <th>status</th>
                                    <th>address</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((userData: any) => {
                                    return (
                                        <tr key={userData.id}>
                                            <td className="whitespace-nowrap">{userData.company_id}</td>
                                            <td className="whitespace-nowrap">{userData.businessName}</td>
                                            <td className="whitespace-nowrap">{userData.contactPersonFullName}</td>
                                            <td className="whitespace-nowrap">{userData.businessType}</td>
                                            <td className="whitespace-nowrap">{userData.phone}</td>
                                            <td className="whitespace-nowrap">{userData.whatsappContact}</td>
                                            <td className="whitespace-nowrap">{userData.email}</td>
                                            <td className="whitespace-nowrap">{userData.status}</td>
                                            <td className="whitespace-nowrap">{userData.address}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary">
                                                        view
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-primary">
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger">
                                                        Delete
                                                    </button>
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
        </div>
    );
};

export default Border;
