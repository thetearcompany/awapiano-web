'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CommunityMember {
    name: string;
    role: string;
    avatar?: string;
    contribution?: string;
}

interface CommunityProps {
    members?: CommunityMember[];
}

export function CommunityContainer({ members = [] }: CommunityProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 py-12 px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto"
            >
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">Our Blessed Community</h1>
                    <p className="text-indigo-200 max-w-2xl mx-auto">
                        Together we create harmony, share light, and elevate the spirit through music.
                        Join us in this divine journey of sound and soul.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {members.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white hover:bg-white/20 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                                    {member.avatar ? (
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl">✨</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{member.name}</h3>
                                    <p className="text-indigo-300">{member.role}</p>
                                </div>
                            </div>
                            {member.contribution && (
                                <p className="mt-4 text-indigo-200">{member.contribution}</p>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16 text-center"
                >
                    <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-indigo-600 transition-colors">
                        Join Our Community
                    </button>
                    <p className="mt-4 text-indigo-200">
                        Let your light shine and share your musical gifts with the world
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
} 