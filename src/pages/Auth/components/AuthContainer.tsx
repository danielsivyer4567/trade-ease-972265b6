import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

interface AuthContainerProps {
  children: React.ReactNode;
}

// Array of background image filenames
const BACKGROUND_IMAGES = [
  'aleeeksanndraa_A_large-scale_commercial_construction_site_in_bl_2f658b1b-7093-4f8f-8798-540084a139fd.png',
  'u9129239767_A_black_and_white_blueprint_from_a_wireframe_on_a_d_5f5a230c-87c6-45ae-8bc7-848be31aa842.png',
  'willy.curchod_BIM_structure_architectural_diagram_--v_6.1_d3770282-e187-4020-a1fe-bdeb43d6388b.png',
  'joelmtz0939_91578_CONCEPT_MAP_COMPONENTS_OF_CONSTRUCTION_PROJEC_4ca79219-806a-43e2-8e9c-7cb278a41bbe.png',
  'momoadel._construction_site_in_abu_dhabi__a_building_is_under_c_aa1be9b7-f081-4466-9645-45d6db0fb03c.png',
  'yulia_67710_medium_shot_storyboard_style_3D_model_of_a_12-story_26dbf43d-1fdf-4500-8793-00ebad7ada8e.png',
  'jnakamura._Construction_project_pure_line_art_--ar_169_--styliz_bceb20ad-1f03-459b-9b86-a0347a274ea7.png',
  'mindylouu_A_black_and_white_photorealistic_image_in_8K_resoluti_b9782071-078d-42a7-9f04-29f560cba1d9.png',
  'logan8_anderson99560_A_captivating_black_and_white_image_illust_dd0e290e-810c-4d77-95f3-bbbafabff2e6.png',
  'u1563348297_3d_building_construction_in_light_tones_--v_6.1_cdd0a8d9-b0f7-46b7-a8df-4a5feb3a7f50.png',
  'firedragonrider_in_the_distant_2_construction_crane_towering_in_9595fc56-1c2c-4385-92ab-e5739ab403df.png',
  'josuahaag_Show_a_working_helmet_wich_is_laying_on_a_table_photo_6166f8e7-696c-4ac5-b2da-a56c870ab4e7.png',
  'kpag24_black_and_white_photorealistic_isometric_cube_view_of_a__e10fd4e4-15bb-419a-8f46-4a5278d78fdf.png',
  'phiteragmbh_52864_a_black-and-white_photo_of_a_small_constructi_9fc0ddcb-5b9f-414a-b816-56305e84139d.png',
  'dianaadil_workers_building_interior_designer_electric_light_mod_239a5a68-3fcf-4516-a912-ba160a55e0f2.png',
  'julienndjuno_metal_bars_on_a_construction_site_--v_6.1_be13a0aa-f57b-4839-bd1a-f64c3a549251.png',
  'cherry_yo_A_black_and_white_photo_of_a_construction_site_with_a_da24b17e-c917-4af8-b560-b8150ba518bb.png',
  'cait.w_black_and_white_photo_real_image_of_construction_site_ar_651d030b-ca88-4560-9de0-4881ae272467.png',
  'Screenshot 2025-04-21 125049.png'
];

// Function to get a random image from the array
const getRandomBackgroundImage = () => {
  const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
  return BACKGROUND_IMAGES[randomIndex];
};

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  // State to hold the current background image
  const [backgroundImage, setBackgroundImage] = useState<string>(getRandomBackgroundImage());

  // Effect to rotate the background image every 20 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundImage(getRandomBackgroundImage());
    }, 20000); // 20 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative">
      {/* Solid background color to match the image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#f0f0f0',
        }}
      />
      
      {/* Background image with rotation */}
      <div 
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: `url("/backround-images/${backgroundImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          margin: '0',
          padding: '0',
          transition: 'background-image 1s ease-in-out'
        }}
      />
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Trade Ease</h1>
          <p className="text-gray-600">Simplifying your business operations</p>
        </div>
        {children}
      </div>
    </div>
  );
};
