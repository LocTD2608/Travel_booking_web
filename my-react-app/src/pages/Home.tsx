import React from 'react';

const Home: React.FC = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="relative">
                <div
                    className="absolute inset-0 h-[560px] w-full bg-cover bg-center z-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3eDFSd54niXoHOZ6IJRQYyWr0baIEhyfWLVXwL6-cY_ubBethJ29dvZyLP3uTDMc-ePXds-7sxeHBjotSwoSYmeXbIgc4AlD8bbF0IyfWueEVFB25nPtztWCNQY_CNqNHHI44v5oP4skY4oGd-yvtXyHzNgRUT6829-qBc-FV1Hrhm5kQa3bdvRzzwVKtdpW574XZif9XqID28IXdUSsGq4xI0fVllJJWBZC2Yuq_fCYUxc4TCqq2Ufj5gP68ipPsunz-pGtTZHQ')",
                    }}
                ></div>
                <div className="relative z-10 px-4 md:px-10 lg:px-40 pt-16 pb-32 max-w-7xl mx-auto flex flex-col items-center lg:items-start">
                    <div className="mb-8 text-center lg:text-left drop-shadow-md">
                        <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-2">
                            Dream. Explore. Discover.
                        </h1>
                        <p className="text-white/90 text-lg md:text-xl font-medium">
                            Your next great adventure is just a click away.
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-[1100px] border border-gray-100">
                        <div className="flex gap-6 border-b border-gray-100 pb-4 mb-6 overflow-x-auto">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-primary rounded-full font-bold text-sm whitespace-nowrap border border-gray-200 shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">hotel</span>
                                Hotels
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-500 hover:bg-gray-50 rounded-full font-bold text-sm whitespace-nowrap transition-colors">
                                <span className="material-symbols-outlined text-[20px]">flight</span>
                                Flights
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-500 hover:bg-gray-50 rounded-full font-bold text-sm whitespace-nowrap transition-colors">
                                <span className="material-symbols-outlined text-[20px]">luggage</span>
                                Flight + Hotel
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-500 hover:bg-gray-50 rounded-full font-bold text-sm whitespace-nowrap transition-colors">
                                <span className="material-symbols-outlined text-[20px]">attractions</span>
                                Xperience
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    City, Destination, or Hotel
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-travel-blue">
                                        location_on
                                    </span>
                                    <input
                                        className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-lg border-2 border-transparent focus:border-travel-blue focus:bg-white focus:ring-0 font-medium text-primary transition-all placeholder:text-gray-400"
                                        placeholder="Where do you want to stay?"
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Check-in</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">
                                        calendar_month
                                    </span>
                                    <input
                                        className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-lg border-2 border-transparent focus:border-travel-blue focus:bg-white focus:ring-0 font-medium text-primary transition-all text-sm"
                                        type="date"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">
                                        nights_stay
                                    </span>
                                    <select className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-lg border-2 border-transparent focus:border-travel-blue focus:bg-white focus:ring-0 font-medium text-primary transition-all text-sm appearance-none cursor-pointer">
                                        <option>1 Night</option>
                                        <option>2 Nights</option>
                                        <option>3 Nights</option>
                                        <option>1 Week</option>
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-3 flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Guests</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">
                                            group
                                        </span>
                                        <input
                                            className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-lg border-2 border-transparent focus:border-travel-blue focus:bg-white focus:ring-0 font-medium text-primary transition-all text-sm cursor-pointer"
                                            readOnly
                                            type="text"
                                            defaultValue="2 Adults, 1 Room"
                                        />
                                    </div>
                                </div>
                                <button className="h-12 w-12 bg-primary hover:bg-black text-white rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-all">
                                    <span className="material-symbols-outlined">search</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
                                Pay at Hotel Available
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
                                Free Cancellation
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Access Grid */}
            <main className="layout-container px-4 md:px-10 lg:px-40 pb-20 -mt-20 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                    {[
                        { icon: 'airplane_ticket', title: 'Best Price\nFlights', color: 'blue' },
                        { icon: 'hotel_class', title: 'Luxury\nHotels', color: 'orange' },
                        { icon: 'train', title: 'JR Pass\n& Trains', color: 'green' },
                        { icon: 'local_activity', title: 'Xperience\nActivities', color: 'purple' },
                        { icon: 'directions_bus', title: 'Bus &\nShuttle', color: 'pink' },
                        { icon: 'airport_shuttle', title: 'Airport\nTransfer', color: 'teal' },
                    ].map((item, index) => (
                        <a
                            key={index}
                            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-3 border border-gray-100 group"
                            href="#"
                        >
                            <div className={`w-12 h-12 rounded-full bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center group-hover:bg-${item.color}-600 group-hover:text-white transition-colors`}>
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <span className="text-sm font-bold text-center whitespace-pre-line">{item.title}</span>
                        </a>
                    ))}
                </div>

                {/* Ongoing Promos */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-primary mb-1">Ongoing Promos</h3>
                            <p className="text-gray-500">Don't miss out on these limited time offers</p>
                        </div>
                        <a className="text-travel-blue font-bold text-sm hover:underline flex items-center gap-1" href="#">
                            See All Promos <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUh0E7h4kKz315MnHIzv_UTPH9iYSAgKp5u59CVwebESS8qSBsR-xoVQ2FnLHoG5zZJl_Fogvhc8S0JhBWbxmRMBY0e2ehHNkC1z1VcRZGaNtQxLDWBvFPsZxf9nlwpRZ4fC5oBPlOw-cT8QWF6VVE7zimKRvocqbiKSv5f4cA9S9W8vrQIgFuW7Yk5ktPwbIWZaPyOG527-J3nX-IawG9l7rUMl5xXTHdd5FRn9LzMkLbuXDkUyImJ5mM6g3gCN9PAqVNmcLU47c',
                                badge: 'LIMITED TIME',
                                badgeColor: 'yellow-400',
                                title: 'Up to 20% Off\nDining Vouchers'
                            },
                            {
                                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMv7gS5O3bc8_67hLa_ydpldx0r7L-BjMVVuBXmPyPgxNAKGl4T3lEVXH7yom2ylDE7ZXpw0ydLkviVAoRUd3fiznhTZOp1e_anYolCVExsN7jbxyhTLXMBiuIIsrjUTR1rSLBebaqGKiWZ57YKgfPR-owgYKTWy1qgRIoFXWfU7YIMmjoBYyH7qnu0j629oPlTus3NFbKsejq68LMsWL2MnMHMmI2TFvTAgPLJkHPb0SJvQoQZNRzy3xC3MbkUjXzR81uOH4M0-g',
                                badge: 'FLIGHT DEAL',
                                badgeColor: 'travel-blue',
                                title: 'International Flights\nStarting from $199'
                            },
                            {
                                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOUxGIqRVbUdCmNozeycTjPhDt_WulULzmrpwAYNT23GLnTpMZIjQx3_lMKlzxDiPhxyoPNv94FFLJ1h5LsFyBY9HCq9S1hDbYRY4rn8cJQUil7v5O8Ii3aJSaS5-tLEvLTVfgYcbBKlyuGWlxWvtpPur_Vl4dqHseFqq9iJIkY4t1srjZcnCy0hJyD_el7_KKlhpACaERsV-cfTdy2YQ-KFLzUobD6DqOpaGzJIm44DDbz1bmqcOOD4IUT7525OZGvfKAZTKNxE0',
                                badge: 'STAYCATION',
                                badgeColor: 'purple-500',
                                title: 'Weekend Getaway\nPackages'
                            },
                        ].map((promo, index) => (
                            <div key={index} className="group relative h-48 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${promo.image}')` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-5">
                                    <span className={`inline-block px-2 py-1 bg-${promo.badgeColor} text-${promo.badgeColor === 'yellow-400' ? 'black' : 'white'} text-xs font-bold rounded mb-2`}>
                                        {promo.badge}
                                    </span>
                                    <h4 className="text-white font-bold text-lg leading-tight whitespace-pre-line">{promo.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Exclusive Offers - Coupons */}
                <section className="mb-12 bg-blue-50 rounded-2xl p-6 md:p-8 border border-blue-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-primary mb-1">Exclusive Offers</h3>
                            <p className="text-gray-500">Grab these coupons for extra savings</p>
                        </div>
                        <a className="text-travel-blue font-bold text-sm hover:underline flex items-center gap-1" href="#">
                            View All Coupons <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {[
                            { icon: 'flight_takeoff', color: 'blue', discount: 'Save $50', title: 'International Flights', subtitle: 'Min. spend $500 • Valid until Dec 31', code: 'FLYHIGH' },
                            { icon: 'hotel', color: 'orange', discount: '15% OFF', title: 'First Hotel Booking', subtitle: 'Max discount $30 • New users only', code: 'STAYLUXE' },
                            { icon: 'local_activity', color: 'purple', discount: '10% Back', title: 'Xperience Activity', subtitle: 'Cashback in points • All activities', code: 'FUNTIME' },
                        ].map((coupon, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 flex relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="p-5 flex-1 flex flex-col justify-center">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-full bg-${coupon.color}-100 text-${coupon.color === 'blue' ? 'travel-blue' : coupon.color === 'orange' ? 'orange-500' : 'purple-600'} flex items-center justify-center shrink-0`}>
                                            <span className="material-symbols-outlined text-2xl">{coupon.icon}</span>
                                        </div>
                                        <div>
                                            <span className={`block text-2xl font-black text-${coupon.color === 'blue' ? 'travel-blue' : coupon.color === 'orange' ? 'orange-500' : 'purple-600'}`}>
                                                {coupon.discount}
                                            </span>
                                            <h4 className="font-bold text-primary text-sm">{coupon.title}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{coupon.subtitle}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative w-px border-l-2 border-dashed border-gray-200 my-3">
                                    <div className="absolute -top-4 -left-[5px] w-3 h-3 rounded-full bg-blue-50"></div>
                                    <div className="absolute -bottom-4 -left-[5px] w-3 h-3 rounded-full bg-blue-50"></div>
                                </div>

                                <div className="p-4 w-36 bg-gray-50/50 flex flex-col items-center justify-center gap-3">
                                    <div className="text-center w-full">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1 tracking-wider">Promo Code</span>
                                        <div className="text-sm font-bold text-gray-600 bg-white px-2 py-1.5 rounded border border-gray-200 border-dashed w-full text-center tracking-wide font-mono">
                                            {coupon.code}
                                        </div>
                                    </div>
                                    <button className="w-full text-travel-blue text-xs font-bold hover:bg-blue-50 hover:border-blue-200 border border-transparent px-3 py-1.5 rounded transition-colors flex items-center justify-center gap-1 uppercase">
                                        Copy <span className="material-symbols-outlined text-sm">content_copy</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Popular Destinations */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-primary mb-1">Popular Destinations</h3>
                            <p className="text-gray-500">Trending spots for travelers from your region</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdIV-mcWLwmgavcRXse7Xu5pvGA6xrII2tYUSEJUDtH6r1X0EYvCzK6jaITBHixVwjwHOjepyqniZP4xajDAV4R4b-MGdCGGYYNTVZpFqorBX7m6c3YfNx1lLqR3uWFd07bTrOhHMgJxcH_hith4VAsY8laM965IrnTgm9ALmDhm7jrMUzf1iiTTVc1p2PcJdKInp8a0GKxC5AFfsIc6sM3N-DclU6C86m9b7QztHAj7PzqNrRRP13H0_LY7PhfWfus5GBLzfFlbs', rating: '4.9', city: 'Tokyo, Japan', price: '$450' },
                            { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_5N2Dv89LlDMJ7n4dzrgLjruOvWtdG-qZn_JVaVNZ2kcU4AlTczvFregIREZOVIMrNlBSZ4UZ7y0F5luXx5rNESKq2m6hHoSBkoBqiboHBc_1iH8yH2rUa_FKaLHQU_J0JCe9fmhz7UZPXMO6svI-iieAtKEGKgJ0pffB6AqECSLYwJgZbhlsQv9XgSbt9dWzOoRjdVFa7Zjdb0X2evvQlqmFgp98U8D_YKyqws0atT4jhwBD2v6t70zhUBaksGE3IREamA1v3bI', rating: '4.8', city: 'Singapore', price: '$120' },
                            { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO0goVIhlbzeMQ61KemMzFFfQg_FQ_z1GzQ57JVeVMDoBGucZbxu_YbKTx75nbC5aUAg3eX9QjFbQtfTPDOUqVyVO7cZYXb-I-oB2Waz07aPGFNRMpVYcp1tDH7uDFKGll-jjBKQ5d4Xtbrj4ipxfBCIJfdmh4NKd66ri6iPL4TosDQ83xAnVgnCfZ8Yy9sF-SSJ3gj0Vfa9RO1GDkz9YiJnwU1Cf8xB4TrqA5MgzpTM_mSYS7xElyHuGyRLqlRGBpu6CQ5PeO1zg', rating: '4.7', city: 'Bali, Indonesia', price: '$35/night' },
                            { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw2DlHzNi0lXvZmUjh0Xp0VVa5rBowR5WjMyANtP9j16j8BeTuuzMTbZTl1qDO1ZjOius3qXLoJpMhlXGchoCdcouKoiaAp2DLxAuOG8e5BcKyP22I3k8PhnpyPZA78EJEK88rZNfqnlqLeAVQ0PhnoEi2xsHWz13TBKtgjDQm8s6_V_LvMce2Pb_ndFYRPKgvd5tUkvdbnBrOBJ_J1aWbMqdULQfn8cF7Dnbqz6dGTAzyhIE_dj65GkC6V5sB0-Xa9fQdSf6gqY8', rating: '4.6', city: 'London, UK', price: '$680' },
                        ].map((dest, index) => (
                            <div key={index} className="group flex flex-col gap-3 cursor-pointer">
                                <div className="relative h-64 rounded-xl overflow-hidden shadow-sm">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${dest.image}')` }}
                                    ></div>
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                                        {dest.rating} ★
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg group-hover:text-travel-blue transition-colors">{dest.city}</h4>
                                    <p className="text-sm text-gray-500">
                                        {dest.price.includes('night') ? 'Hotels from' : 'Flights from'}{' '}
                                        <span className="font-bold text-orange-600">{dest.price}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Book With Traveloka */}
                <section className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
                    <h3 className="text-2xl font-black text-center mb-10">Why Book With Traveloka?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: 'verified_user', title: 'Secure Transactions', desc: 'Your security is our priority. We use advanced encryption to protect your payments.' },
                            { icon: 'savings', title: 'Best Price Guarantee', desc: "Find a lower price elsewhere? We'll match it and give you a discount on your next booking." },
                            { icon: 'support_agent', title: '24/7 Customer Support', desc: 'Our team is available round the clock to assist you with any questions or issues.' },
                        ].map((feature, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-travel-blue">
                                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
