import React from 'react';
import classes from "./QuickAccessButtons.module.css";
import { Button, Typography } from '@material-tailwind/react';


const QuickAccessButtons = ({title, iconsvg1, description1, iconsvg2, description2, iconsvg3, description3, link1, link2, link3}) => {
    return (
        <div className={[classes["QuickAccessContainer"]]}>
        <div className={[classes["QuickAccessButtonsContainer"]]}>
            {
                iconsvg1 && description1 && link1 && iconsvg2 && description2 && link2 && iconsvg1 && description1 && link1 ?(
                    <div className={[classes["QuickAccessTitleContainer"]]}>
                        <Typography className='text-darkBlueMasferrer font-masferrerTitle font-bold
                        uppercase text-xl my-2
                        Mobile-390*844:text-sm
                            Mobile-280:text-sm
                        '>{title}</Typography>
                    </div>
                ) : (
                    <>
                    </>
                )
            }
                <div className={[classes["QuickAccessButtons"]]}>
                    {
                        iconsvg1 && description1 && link1 ? (
                            <div className={[classes["QuickAccessButtonContainer"]]}>
                                <a href={link1}>
                                <Button color="white" className='w-auto h-auto flex flex-row justify-center
                                rounded-full px-12 my-4 hover:shadow-2xl hover:bg-gray-400 mx-2 max-w-80
                                PC-1280*720:my-0 PC-1280*720:mx-2 PC-1280*720:px-4
                                PC-800*600:my-0 PC-800*600:mx-2 PC-800*600:px-4 PC-800*600:w-auto PC-800*600:h-auto
                                PC-640*480:my-0 PC-640*480:mx-2 PC-640*480:px-4 PC-640*480:w-auto PC-640*480:h-auto
                                Mobile-390*844:my-0 Mobile-390*844:mx-2 Mobile-390*844:px-20 Mobile-390*844:w-auto Mobile-390*844:h-auto
                                Mobile-280:my-0 Mobile-280:mx-2 Mobile-280:px-20 Mobile-280:w-auto Mobile-280:h-auto
                                IpadAir:my-0 IpadAir:mx-0 IpadAir:px-4 IpadAir:w-auto IpadAir:h-auto'>
                                    <img src={iconsvg1} alt="icon" className='
                                    PC-1280*720:w-7 PC-1280*720:h-7 
                                    PC-640*480:w-7 PC-640*480:h-7
                                    PC-800*600:w-7 PC-800*600:h-7
                                    IpadAir:w-6 IpadAir:h-6 IpadAir:mx-0
                                    Mobile-390*844:w-7 Mobile-390*844:h-7
                                    my-auto
                                    w-10 h-10 mx-4' />
                                    <Typography className='text-sm justify-center my-auto
                                    font-masferrerTitle font-normal PC-1280*720:text-xs 
                                    PC-800*600:text-xs
                                    PC-640*480:text-xs
                                    Mobile-390*844:text-xs
                                    Mobile-280:text-xs
                                    IpadAir:text-xs'>{description1}</Typography>
                                </Button>
                                </a>
                            </div>
                        ) : (
                            <Typography className='text-darkBlueMasferrer font-masferrerTitle font-bold
                                uppercase text-xl my-2
                                Mobile-390*844:text-sm
                                Mobile-280:text-sm'>
                                {title}
                            </Typography>
                        )
                    }
                    {
                        description2 && iconsvg2 && link2 ? (
                            <div className={[classes["QuickAccessButtonContainer"]]}>
                                <a href={link2}>
                                <Button color="white" className='w-auto h-auto flex flex-row justify-center
                                rounded-full px-12 my-4 hover:shadow-2xl hover:bg-gray-400 mx-2 max-w-80
                                PC-1280*720:my-0 PC-1280*720:mx-2 PC-1280*720:px-4
                                PC-800*600:my-0 PC-800*600:mx-2 PC-800*600:px-4 PC-800*600:w-auto PC-800*600:h-auto
                                PC-640*480:my-0 PC-640*480:mx-2 PC-640*480:px-4 PC-640*480:w-auto PC-640*480:h-auto
                                Mobile-390*844:my-0 Mobile-390*844:mx-2 Mobile-390*844:px-20 Mobile-390*844:w-auto Mobile-390*844:h-auto
                                Mobile-280:my-0 Mobile-280:mx-2 Mobile-280:px-20 Mobile-280:w-auto Mobile-280:h-auto
                                IpadAir:my-0 IpadAir:mx-0 IpadAir:px-4 IpadAir:w-auto IpadAir:h-auto'>
                                    <img src={iconsvg2} alt="icon" className='
                                    PC-1280*720:w-7 PC-1280*720:h-7 
                                    PC-640*480:w-7 PC-640*480:h-7
                                    PC-800*600:w-7 PC-800*600:h-7
                                    IpadAir:w-6 IpadAir:h-6 IpadAir:mx-0
                                    Mobile-390*844:w-7 Mobile-390*844:h-7
                                    my-auto
                                    w-10 h-10 mx-4' />
                                    <Typography className='text-sm justify-center my-auto 
                                    font-masferrerTitle font-normal PC-1280*720:text-xs 
                                    PC-800*600:text-xs
                                    PC-640*480:text-xs
                                    Mobile-390*844:text-xs
                                    Mobile-280:text-xs
                                    IpadAir:text-xs'>{description2}</Typography>
                                </Button>
                                </a>
                            </div>
                        ) : (
                            <div className='w-emptyButton h-auto flex flex-row justify-center
                                rounded-full px-12 my-4 
                                PC-1280*720:my-0 PC-1280*720:mx-2 PC-1280*720:px-4
                                PC-800*600:my-0 PC-800*600:mx-2 PC-800*600:px-4 PC-800*600:w-auto PC-800*600:h-auto
                                PC-640*480:my-0 PC-640*480:mx-2 PC-640*480:px-4 PC-640*480:w-auto PC-640*480:h-auto
                                Mobile-390*844:my-0 Mobile-390*844:mx-2 Mobile-390*844:px-20 Mobile-390*844:w-auto Mobile-390*844:h-auto
                                Mobile-280:my-0 Mobile-280:mx-2 Mobile-280:px-20 Mobile-280:w-auto Mobile-280:h-auto
                                IpadAir:my-0 IpadAir:mx-0 IpadAir:px-4 IpadAir:w-auto IpadAir:h-auto'>
                            </div>
                        )
                    }
                    {
                        description3 && iconsvg3 && link3 ? (
                            <div className={[classes["QuickAccessButtonContainer"]]}>
                                <a href={link3}>
                                <Button color="white" className='w-auto h-auto flex flex-row justify-center
                                rounded-full px-12 hover:shadow-2xl hover:bg-gray-400 mx-2 max-w-80
                                my-4 PC-1280*720:my-0 PC-1280*720:mx-2 PC-1280*720:px-4
                                PC-800*600:my-0 PC-800*600:mx-2 PC-800*600:px-4 PC-800*600:w-auto PC-800*600:h-auto
                                PC-640*480:my-0 PC-640*480:mx-2 PC-640*480:px-4 PC-640*480:w-auto PC-640*480:h-auto
                                Mobile-390*844:my-0 Mobile-390*844:mx-2 Mobile-390*844:px-20 Mobile-390*844:w-auto Mobile-390*844:h-auto
                                Mobile-280:my-0 Mobile-280:mx-2 Mobile-280:px-20 Mobile-280:w-auto Mobile-280:h-auto
                                IpadAir:my-0 IpadAir:mx-0 IpadAir:px-4 IpadAir:w-auto IpadAir:h-auto'>
                                    <img src={iconsvg3} alt="icon" className='
                                    PC-1280*720:w-7 PC-1280*720:h-7 
                                    PC-640*480:w-7 PC-640*480:h-7
                                    PC-800*600:w-7 PC-800*600:h-7
                                    IpadAir:w-6 IpadAir:h-6 IpadAir:mx-0
                                    Mobile-390*844:w-7 Mobile-390*844:h-7
                                    my-auto
                                    w-10 h-10 mx-4' />
                                    <Typography className='text-sm justify-center my-auto 
                                    font-masferrerTitle font-normal PC-1280*720:text-xs 
                                    PC-800*600:text-xs
                                    PC-640*480:text-xs
                                    Mobile-390*844:text-xs
                                    Mobile-280:text-xs
                                    IpadAir:text-xs'>{description3}</Typography>
                                </Button>
                                </a>
                            </div>
                        ) : (
                            <div className='w-emptyButton h-auto flex flex-row justify-center
                                rounded-full px-12 my-4 
                                PC-1280*720:my-0 PC-1280*720:mx-2 PC-1280*720:px-4
                                PC-800*600:my-0 PC-800*600:mx-2 PC-800*600:px-4 PC-800*600:w-auto PC-800*600:h-auto
                                PC-640*480:my-0 PC-640*480:mx-2 PC-640*480:px-4 PC-640*480:w-auto PC-640*480:h-auto
                                Mobile-390*844:my-0 Mobile-390*844:mx-2 Mobile-390*844:px-20 Mobile-390*844:w-auto Mobile-390*844:h-auto
                                Mobile-280:my-0 Mobile-280:mx-2 Mobile-280:px-20 Mobile-280:w-auto Mobile-280:h-auto
                                IpadAir:my-0 IpadAir:mx-0 IpadAir:px-4 IpadAir:w-auto IpadAir:h-auto'>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default QuickAccessButtons;