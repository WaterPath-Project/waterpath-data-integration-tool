import { FC, SVGProps } from "react";

export const HeaderLogo: FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      width="316"
      height="200"
      viewBox="0 0 316 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M189.22 86.4203C170.763 4.34813 74.1824 -12.5693 26.1694 38.7981C24.0607 41.0541 24.3459 44.5592 26.6151 46.5409L71.5422 85.7746C72.0631 86.2295 72.154 87.0054 71.7523 87.5684C71.2988 88.204 70.4012 88.321 69.7999 87.8229L24.533 50.3222C21.96 48.1906 18.0522 48.8085 16.345 51.7395C5.79823 69.8466 0.439276 86.6325 0.0259265 103.237C-0.387489 119.843 4.14951 136.139 13.1863 153.258C14.6998 156.125 18.3405 156.982 21.0047 155.226L69.5774 123.212C70.1952 122.805 71.0231 122.949 71.467 123.541C71.9427 124.175 71.797 125.077 71.146 125.529L23.8675 158.378C21.241 160.203 20.6835 163.913 22.7945 166.386C28.3651 172.912 32.9739 177.16 39.9163 182.558C42.3801 184.473 45.9199 183.92 47.7244 181.409L82.3938 133.164C82.7094 132.725 83.3019 132.588 83.7784 132.844C84.3462 133.149 84.5208 133.881 84.1518 134.409L51.3231 181.425C49.3799 184.208 50.3788 188.122 53.5377 189.522C73.9758 198.573 92.9233 201.806 110.97 199.027C129.017 196.249 146.016 187.48 162.596 172.783C164.215 171.347 166.406 171.2 168.208 172.015C170 172.825 171.23 174.499 171.089 176.603L170.209 189.811C169.996 192.996 172.523 195.697 175.715 195.697H185.752C188.8 195.697 191.271 193.226 191.271 190.178V183.305C191.271 181.914 192.399 180.786 193.79 180.786H207.545C208.936 180.786 210.064 181.914 210.064 183.305V190.756C210.064 193.484 212.276 195.697 215.005 195.697C217.733 195.697 219.945 193.484 219.945 190.756V124.809C219.945 123.418 221.073 122.29 222.464 122.29H239.66C241.051 122.29 242.179 123.418 242.179 124.809V191.329C242.179 193.741 244.134 195.697 246.546 195.697C248.958 195.697 250.914 193.741 250.914 191.329V143.161C250.914 141.77 252.041 140.642 253.432 140.642H269.481C270.872 140.642 272 141.77 272 143.161V190.178C272 193.226 274.471 195.697 277.519 195.697H288.411C289.239 195.697 289.911 195.025 289.911 194.197C289.911 193.368 289.239 192.697 288.411 192.697H277.519C276.128 192.697 275 191.569 275 190.178V143.161C275 140.113 272.529 137.642 269.481 137.642H253.432C250.385 137.642 247.914 140.113 247.914 143.161V191.329C247.914 192.084 247.301 192.697 246.546 192.697C245.791 192.697 245.179 192.084 245.179 191.329V124.809C245.179 121.761 242.708 119.29 239.66 119.29H222.464C219.416 119.29 216.945 121.761 216.945 124.809V190.756C216.945 191.828 216.077 192.697 215.005 192.697C213.933 192.697 213.064 191.828 213.064 190.756V183.305C213.064 180.257 210.593 177.786 207.545 177.786H193.79C190.742 177.786 188.271 180.257 188.271 183.305V190.178C188.271 191.569 187.144 192.697 185.752 192.697H175.715C174.258 192.697 173.105 191.464 173.202 190.01L174.083 176.803C174.32 173.247 172.179 170.518 169.445 169.281C166.721 168.049 163.231 168.21 160.605 170.538C144.35 184.949 127.864 193.391 110.513 196.062C93.1625 198.734 74.7997 195.657 54.7525 186.778C53.3745 186.168 52.8853 184.428 53.7828 183.143L86.6115 136.127C88.0083 134.126 87.3473 131.355 85.1981 130.201C83.3946 129.232 81.1523 129.751 79.9576 131.413L45.2882 179.659C44.4597 180.811 42.8558 181.043 41.7577 180.189C34.9488 174.896 30.4941 170.785 25.0762 164.438C24.1517 163.355 24.3663 161.685 25.5793 160.842L72.8578 127.993C74.9045 126.571 75.3624 123.734 73.867 121.741C72.4715 119.88 69.8686 119.427 67.9265 120.707L19.3538 152.721C18.1258 153.53 16.5019 153.113 15.8393 151.857C6.9802 135.075 2.6273 119.287 3.025 103.311C3.42276 87.3333 8.57593 71.0383 18.9373 53.2494C19.6865 51.9632 21.4339 51.6506 22.6191 52.6325L67.886 90.1331C69.8288 91.7426 72.7292 91.3645 74.1945 89.3109C75.4923 87.4918 75.1987 84.9848 73.5155 83.515L28.5884 44.2812C27.54 43.3656 27.462 41.8085 28.3611 40.8466C74.8539 -8.89434 168.405 7.53414 186.293 87.0785C186.603 88.455 185.638 89.8287 184.2 90.0072L127.507 97.0505C124.935 97.37 123.132 99.7465 123.518 102.309C123.857 104.565 125.795 106.233 128.075 106.233H185.654C187.079 106.233 188.192 107.403 188.123 108.777C187.352 124.33 184.285 134.898 176.53 151.702C175.914 153.037 174.264 153.544 172.985 152.774L115.001 117.829C114.397 117.465 113.64 117.576 113.164 118.054C113.052 118.136 112.95 118.235 112.861 118.351C109.237 123.07 103.696 126.277 97.2987 126.746C85.3968 127.618 75.0412 118.677 74.1688 106.775C73.2965 94.873 82.2377 84.5173 94.1397 83.645C106.042 82.7727 116.397 91.7139 117.27 103.616C117.33 104.446 118.053 105.07 118.883 105.009C119.713 104.948 120.336 104.226 120.276 103.396C119.282 89.8334 107.481 79.6449 93.9193 80.639C80.3572 81.633 70.1688 93.4331 71.1628 106.995C72.1568 120.557 83.9569 130.746 97.519 129.752C104.407 129.247 110.427 125.953 114.55 121.06L171.437 155.343C174.226 157.024 177.88 155.937 179.254 152.959C187.122 135.911 190.324 124.963 191.12 108.925C191.275 105.79 188.745 103.233 185.654 103.233H128.075C127.279 103.233 126.603 102.651 126.484 101.863C126.35 100.969 126.979 100.139 127.877 100.028L184.57 92.9843C187.729 92.5919 189.927 89.5625 189.22 86.4203Z"
        fill="#0B4159"
      />
      <g style={{ mixBlendMode: "darken" }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M252.3 13.7217C250.47 12.9836 249.586 10.902 250.324 9.07225C251.062 7.24253 253.143 6.3576 254.973 7.09569C257.257 8.01684 259.085 9.32665 260.391 11.0632C261.696 12.7989 262.308 14.7319 262.526 16.6239C262.921 20.0652 262.027 23.8531 261.311 26.8835L261.238 27.1927C260.906 28.6034 260.614 29.8718 260.402 31.0195C261.678 31.4219 262.936 31.9405 264.163 32.5794C265.471 33.2607 266.688 34.0491 267.807 34.9284C268.026 33.9416 268.233 32.8553 268.453 31.6671L268.511 31.3547C269.078 28.2931 269.787 24.4661 271.537 21.4766C272.499 19.8329 273.839 18.3109 275.733 17.2491C277.629 16.1868 279.83 15.7254 282.291 15.8034C284.263 15.8659 285.811 17.5151 285.749 19.4871C285.686 21.4591 284.037 23.007 282.065 22.9446C280.645 22.8996 279.782 23.1705 279.226 23.4818C278.67 23.7937 278.171 24.2867 277.703 25.0857C276.654 26.8788 276.125 29.4866 275.478 32.9718L275.42 33.2842C274.97 35.715 274.43 38.6282 273.351 41.2217C274.236 42.6988 274.952 44.2667 275.489 45.8931C276.865 45.4377 278.208 45.1165 279.348 44.844C279.568 44.7913 279.781 44.7404 279.985 44.6908C281.362 44.3553 282.431 44.0704 283.289 43.721C284.144 43.373 284.479 43.0804 284.607 42.9217L284.609 42.9194C284.665 42.8491 284.821 42.6553 284.796 41.9863C284.767 41.206 284.486 39.9065 283.572 37.8779C282.763 36.0788 283.564 33.9638 285.363 33.1538C287.162 32.3438 289.277 33.1456 290.087 34.9447C292.237 39.7198 292.838 44.0858 290.176 47.398C288.978 48.8874 287.395 49.7639 285.982 50.3388C284.572 50.9125 283.023 51.3045 281.675 51.6326L281.448 51.6881C279.503 52.1614 277.929 52.5445 276.665 53.0616C276.683 56.2226 276.054 59.4274 274.716 62.479C274.837 62.506 274.964 62.5302 275.097 62.5515C277.148 62.8808 279.77 62.4296 283.254 61.7715L283.566 61.7124C286.625 61.133 290.449 60.4087 293.869 60.9577C295.75 61.2595 297.653 61.9572 299.329 63.3391C301.005 64.7216 302.232 66.6064 303.05 68.9288C303.706 70.7897 302.729 72.8297 300.868 73.4853C299.007 74.1408 296.967 73.1637 296.312 71.3028C295.839 69.9628 295.275 69.2564 294.783 68.8512C294.291 68.4454 293.651 68.1589 292.737 68.0121C290.685 67.6828 288.063 68.1339 284.58 68.7921L284.268 68.8511C281.208 69.4306 277.384 70.1549 273.964 69.6059C273.1 69.4671 272.23 69.2447 271.38 68.9105C270.202 71.0908 269.038 73.1868 267.878 75.2098C267.61 76.4062 267.687 76.9942 267.744 77.2057C267.774 77.3166 267.781 77.3347 267.902 77.4138C268.127 77.5609 268.596 77.7602 269.497 77.9323C270.387 78.1023 271.403 78.1961 272.643 78.3066L272.725 78.3139L272.726 78.3139L272.726 78.314C273.87 78.4158 275.22 78.5361 276.495 78.7795C277.79 79.0267 279.311 79.4518 280.666 80.3397C282.125 81.2955 283.286 82.723 283.809 84.6733C284.3 86.5049 284.151 88.5085 283.624 90.5927C283.14 92.5055 281.198 93.6638 279.285 93.1801C277.372 92.6963 276.214 90.7535 276.698 88.8407C277.055 87.427 276.97 86.7537 276.908 86.524C276.878 86.4132 276.871 86.3951 276.75 86.3159C276.526 86.1689 276.056 85.9695 275.155 85.7975C274.265 85.6275 273.249 85.5337 272.009 85.4232L271.927 85.4158C270.783 85.314 269.432 85.1937 268.157 84.9503C266.862 84.7031 265.342 84.278 263.986 83.39C263.742 83.2298 263.506 83.0564 263.28 82.8694C261.707 85.3637 260.117 87.7531 258.486 90.066C258.735 90.2288 258.976 90.3991 259.21 90.5755C261.975 92.6613 264.102 95.9206 265.804 98.5282L265.978 98.7942C267.917 101.762 269.408 103.965 271.067 105.216C271.806 105.774 272.456 106.037 273.09 106.111C273.722 106.184 274.623 106.102 275.917 105.514C277.713 104.697 279.831 105.491 280.647 107.287C281.464 109.083 280.67 111.201 278.874 112.018C276.632 113.037 274.423 113.458 272.265 113.208C270.107 112.957 268.285 112.067 266.765 110.921C263.999 108.835 261.872 105.575 260.17 102.968L259.996 102.702C258.058 99.7342 256.566 97.5308 254.907 96.2797C254.668 96.0994 254.438 95.9499 254.215 95.8276C251.789 98.939 249.241 101.946 246.501 104.927C246.515 104.944 246.534 104.963 246.557 104.986C246.747 105.175 247.167 105.465 248.015 105.814C248.853 106.159 249.829 106.455 251.022 106.813L251.101 106.836C252.201 107.166 253.501 107.555 254.7 108.049C255.919 108.552 257.324 109.274 258.473 110.416C259.71 111.645 260.561 113.277 260.682 115.292C260.795 117.185 260.247 119.118 259.312 121.054C258.454 122.831 256.318 123.575 254.541 122.717C252.765 121.859 252.02 119.723 252.878 117.946C253.512 116.633 253.564 115.957 253.55 115.719C253.543 115.605 253.539 115.585 253.437 115.484C253.246 115.294 252.826 115.005 251.978 114.655C251.14 114.31 250.164 114.014 248.971 113.657L248.892 113.633C247.792 113.304 246.493 112.914 245.293 112.42C244.085 111.922 242.694 111.208 241.55 110.082C238.556 113.071 235.331 116.081 231.805 119.192C233.427 120.289 235.759 121.114 238.781 122.134L239.082 122.235C242.033 123.23 245.721 124.473 248.433 126.628C249.924 127.813 251.241 129.354 252.025 131.38C252.808 133.407 252.953 135.651 252.528 138.076C252.187 140.02 250.336 141.319 248.392 140.978C246.449 140.637 245.15 138.786 245.491 136.842C245.736 135.443 245.59 134.55 245.36 133.956C245.13 133.361 244.713 132.798 243.988 132.222C242.361 130.929 239.855 130.037 236.496 128.903L236.195 128.802C233.244 127.807 229.556 126.564 226.844 124.409C226.655 124.258 226.469 124.102 226.286 123.94C225.757 124.385 225.222 124.832 224.681 125.282C223.803 126.011 222.887 126.666 221.94 127.245C221.685 127.621 221.588 127.871 221.553 127.999C221.523 128.11 221.52 128.129 221.585 128.258C221.705 128.498 222.011 128.907 222.703 129.509C223.387 130.103 224.217 130.695 225.234 131.415L225.301 131.462C226.238 132.126 227.346 132.909 228.325 133.761C229.32 134.626 230.42 135.758 231.145 137.207C231.925 138.767 232.211 140.585 231.682 142.534C231.185 144.364 230.049 146.021 228.545 147.557C227.165 148.967 224.903 148.991 223.493 147.61C222.083 146.23 222.059 143.968 223.439 142.559C224.459 141.517 224.724 140.892 224.787 140.662C224.817 140.551 224.819 140.532 224.755 140.403C224.635 140.163 224.329 139.754 223.637 139.152C222.953 138.558 222.122 137.966 221.106 137.246L221.039 137.199L221.038 137.199L221.038 137.198C220.101 136.535 218.994 135.752 218.015 134.9C217.02 134.036 215.919 132.903 215.195 131.454C214.984 131.033 214.81 130.594 214.678 130.139C213.335 130.423 211.974 130.587 210.613 130.632C210.675 133.548 210.032 136.586 209.499 139.104L209.433 139.415C208.701 142.884 208.194 145.496 208.48 147.554C208.607 148.471 208.88 149.117 209.275 149.617C209.67 150.117 210.364 150.697 211.693 151.198C213.54 151.893 214.473 153.953 213.778 155.799C213.083 157.646 211.023 158.579 209.176 157.884C206.872 157.017 205.014 155.75 203.667 154.045C202.321 152.34 201.664 150.422 201.403 148.535C200.927 145.104 201.732 141.296 202.377 138.25L202.443 137.939C203.175 134.471 203.682 131.859 203.396 129.801L203.39 129.756L203.386 129.731C201.774 129.266 200.206 128.625 198.714 127.811C198.186 127.961 197.616 127.99 197.041 127.875C195.612 127.588 194.943 127.707 194.717 127.78C194.608 127.815 194.59 127.824 194.517 127.948C194.381 128.18 194.206 128.659 194.079 129.567C193.953 130.465 193.91 131.484 193.862 132.728L193.859 132.811C193.814 133.958 193.761 135.313 193.581 136.599C193.399 137.904 193.05 139.444 192.231 140.842C191.349 142.347 189.981 143.578 188.06 144.197C186.255 144.779 184.246 144.731 182.138 144.308C180.204 143.92 178.95 142.037 179.338 140.103C179.726 138.169 181.608 136.915 183.543 137.303C184.973 137.589 185.641 137.47 185.867 137.397C185.976 137.362 185.994 137.354 186.067 137.229C186.203 136.998 186.378 136.519 186.505 135.61C186.631 134.713 186.674 133.694 186.722 132.449L186.726 132.367C186.77 131.22 186.823 129.864 187.003 128.579C187.185 127.273 187.534 125.733 188.353 124.336C189.043 123.158 190.031 122.149 191.348 121.468C190.12 119.853 189.134 118.124 188.387 116.326C187.158 116.77 185.865 117.096 184.718 117.375L184.491 117.431C181.617 118.13 179.553 118.633 178.101 119.661C177.466 120.111 177.028 120.621 176.738 121.284C176.438 121.972 176.202 123.046 176.33 124.749C176.478 126.716 175.002 128.431 173.035 128.579C171.068 128.726 169.353 127.251 169.205 125.284C169.011 122.705 169.322 120.414 170.191 118.423C171.072 116.408 172.429 114.924 173.97 113.832C176.594 111.973 179.957 111.169 182.391 110.587L182.393 110.586L182.397 110.585L182.404 110.584L182.416 110.581C182.627 110.53 182.832 110.481 183.028 110.433C184.405 110.098 185.474 109.813 186.332 109.464C186.465 109.41 186.585 109.357 186.694 109.306C186.556 107.588 186.609 105.86 186.85 104.158C186.777 103.985 186.699 103.806 186.615 103.621C186.308 102.938 186.233 102.209 186.356 101.524C185.275 101.682 184.088 101.9 182.779 102.147L182.467 102.206C179.408 102.786 175.584 103.51 172.163 102.961C170.283 102.659 168.379 101.962 166.704 100.58C165.027 99.1972 163.8 97.3124 162.982 94.99C162.327 93.1291 163.304 91.0891 165.165 90.4335C167.026 89.778 169.066 90.7551 169.721 92.616C170.193 93.9561 170.758 94.6624 171.249 95.0676C171.742 95.4734 172.382 95.76 173.296 95.9067C175.347 96.236 177.969 95.7849 181.453 95.1267L181.765 95.0677L181.765 95.0677C184.442 94.5606 187.705 93.9426 190.77 94.164C191.938 92.4855 193.35 90.9348 194.999 89.5642C196.071 88.6736 197.105 87.8033 198.106 86.9502C197.859 86.8698 197.544 86.7879 197.143 86.7114C196.253 86.5414 195.238 86.4476 193.997 86.3371L193.915 86.3298C192.771 86.2279 191.42 86.1076 190.145 85.8642C188.851 85.617 187.33 85.1919 185.975 84.304C184.516 83.3482 183.355 81.9207 182.831 79.9704C182.34 78.1388 182.489 76.1352 183.016 74.051C183.5 72.1382 185.443 70.9798 187.355 71.4636C189.268 71.9474 190.427 73.8902 189.943 75.8029C189.585 77.2167 189.671 77.89 189.732 78.1196C189.762 78.2305 189.77 78.2486 189.89 78.3278C190.115 78.4748 190.584 78.6742 191.485 78.8462C192.376 79.0162 193.391 79.11 194.631 79.2205L194.714 79.2279C195.857 79.3297 197.209 79.45 198.483 79.6934C199.778 79.9406 201.299 80.3657 202.654 81.2536C203.015 81.4901 203.357 81.7553 203.677 82.0502C206.438 79.5333 208.913 77.1208 211.191 74.7089C210.876 74.5772 210.57 74.4328 210.273 74.2782C207.308 72.7375 204.81 69.926 202.857 67.7279L202.64 67.4833C200.383 64.9457 198.715 63.1445 197.051 62.2793C196.331 61.9051 195.747 61.7889 195.201 61.8313C194.643 61.8745 193.818 62.1074 192.664 62.9302C191.057 64.0757 188.826 63.702 187.681 62.0956C186.536 60.4892 186.909 58.2584 188.516 57.1129C190.481 55.7118 192.524 54.8727 194.648 54.7079C196.784 54.5422 198.696 55.082 200.346 55.9397C203.31 57.4804 205.808 60.2919 207.761 62.4899L207.978 62.7346C210.236 65.2721 211.903 67.0733 213.568 67.9386C214.288 68.3128 214.871 68.4289 215.417 68.3866C215.845 68.3534 216.429 68.2091 217.197 67.7737C218.793 65.7549 220.314 63.6726 221.804 61.4723C221.693 60.9899 221.681 60.4766 221.786 59.9599C222.076 58.5309 221.959 57.8623 221.887 57.6358C221.852 57.5265 221.843 57.5088 221.719 57.4354C221.488 57.2991 221.01 57.122 220.101 56.9926C219.204 56.8648 218.185 56.8189 216.941 56.7669L216.859 56.7635L216.859 56.7635C215.711 56.7156 214.356 56.659 213.071 56.476C211.767 56.29 210.227 55.937 208.832 55.1139C207.33 54.2278 206.102 52.8567 205.488 50.9332C204.911 49.1267 204.965 47.1183 205.394 45.0116C205.787 43.0782 207.673 41.8296 209.606 42.2228C211.54 42.6159 212.788 44.502 212.395 46.4354C212.105 47.8644 212.222 48.533 212.294 48.7594C212.329 48.8688 212.337 48.8865 212.462 48.9599C212.693 49.0962 213.171 49.2732 214.079 49.4026C214.977 49.5305 215.995 49.5764 217.24 49.6284L217.322 49.6318L217.322 49.6318C218.469 49.6797 219.825 49.7362 221.109 49.9193C222.414 50.1053 223.953 50.4583 225.349 51.2814C226.034 51.6855 226.662 52.1906 227.201 52.803C228.626 50.3372 230.074 47.7014 231.586 44.8477C230.838 44.1631 230.228 43.4012 229.727 42.6959C228.976 41.6376 228.305 40.4586 227.737 39.4607L227.697 39.3889C227.081 38.3066 226.573 37.422 226.049 36.6828C225.518 35.9347 225.141 35.5905 224.914 35.4474C224.792 35.3704 224.773 35.3711 224.659 35.3901C224.425 35.4295 223.777 35.6315 222.64 36.5442C221.101 37.7791 218.853 37.5327 217.618 35.9939C216.383 34.4551 216.629 32.2067 218.168 30.9719C219.845 29.6263 221.605 28.6584 223.475 28.3442C225.467 28.0095 227.248 28.4728 228.723 29.4026C230.094 30.2663 231.113 31.473 231.875 32.5479C232.627 33.6062 233.297 34.7852 233.865 35.7831L233.906 35.8549C234.492 36.8848 234.98 37.7357 235.478 38.4526C237.434 36.061 239.813 34.1327 242.444 32.721C239.98 30.909 236.985 28.6627 235.12 25.8812C234.059 24.2996 233.271 22.4311 233.14 20.2632C233.009 18.0942 233.552 15.9117 234.693 13.73C235.608 11.9819 237.767 11.3062 239.515 12.2208C241.263 13.1355 241.938 15.2941 241.024 17.0422C240.365 18.3012 240.233 19.196 240.272 19.8317C240.31 20.4684 240.537 21.132 241.053 21.9008C242.21 23.6263 244.328 25.2374 247.184 27.3373L247.44 27.5254C248.495 28.3005 249.661 29.157 250.802 30.1033C251.639 30.0067 252.484 29.9555 253.332 29.9508C253.586 28.5103 253.914 27.1213 254.211 25.863L254.284 25.5538C255.097 22.1034 255.665 19.504 255.428 17.4398C255.322 16.5201 255.064 15.8678 254.681 15.358C254.298 14.8491 253.618 14.2532 252.3 13.7217ZM199.944 115.647C195.402 110.181 196.15 102.069 201.616 97.5268C221.868 80.6967 230.07 70.1996 242.027 47.2338C245.308 40.9305 253.079 38.481 259.382 41.7626C265.685 45.0443 268.135 52.8144 264.853 59.1177C251.385 84.9864 241.058 98.2105 218.064 117.319C212.598 121.861 204.486 121.112 199.944 115.647ZM244.025 73.7775C248.441 75.346 253.293 73.0374 254.861 68.6211C256.43 64.2047 254.121 59.353 249.705 57.7845C245.288 56.216 240.437 58.5246 238.868 62.9409C237.3 67.3572 239.608 72.2089 244.025 73.7775Z"
          fill="#9AE0A5"
        />
      </g>
    </svg>
  );
};