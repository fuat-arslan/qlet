import pandas as pd
import numpy as np
import os
from PIL import Image

# turn all the images to .png
# def convert_to_png():
#     for filename in os.listdir('public/images'):
            
#         img = Image.open(f'public/images/{filename}')
#         img.save(f'public/images/{filename[:-4]}.png')
#         os.remove(f'public/images/{filename}')


    
# # read txt file and convert it to csv
# def txt_to_csv():
#     # #First columns is os.listdir('public/images')
#     df = pd.read_csv('data/QYAZILI.txt', sep=",")
#     df.to_csv('data/QYAZILI.csv', index=True)
#     # os.remove('public/images/QYAZILI.txt')
#     return df
# # #First columns is os.listdir('public/images')
# df = txt_to_csv()
# # convert_to_png()
# print(df)
# ends with .png
# img_paths = [f'public/images/{i}' for i in os.listdir('public/images') if i.endswith('.png')]
# df['ImagePath'] = img_paths

df = pd.read_csv('data/all_data.csv')
# add ImagePath column all datas images/
df['ImagePath'] = 'images/' + df['ImagePath']
df.to_csv('data/all_data.csv', index=False)