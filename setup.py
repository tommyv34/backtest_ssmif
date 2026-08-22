from setuptools import setup, Extension
import pybind11

ext_modules = [
    Extension(
        "backtesting.backtesting_cpp",
        sources=[
            "backend/backtesting/bindings.cpp",
            "backend/backtesting/engine.cpp",
            "backend/backtesting/portfolio.cpp",
            "backend/backtesting/strategy.cpp",
        ],
        include_dirs=[
            pybind11.get_include(),
            "backend/backtesting",
        ],
        language="c++",
        extra_compile_args=["-std=c++17"],
    )
]

setup(
    name="backtesting_cpp",
    version="0.1.0",
    package_dir={"": "backend"},
    packages=["backtesting"],
    ext_modules=ext_modules,
)